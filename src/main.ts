import Device, { WorkerMessage } from './device/Device';
import Input from './input/Input';
import Camera from './camera/Camera';
import Clock from './clock/Clock.js';
import SceneBuilder from './builder/SceneBuilder.js';
import CommandInvoker from './builder/CommandInvoker.js';
import TiledMapBuilder from './builder/TiledMapBuilder.js';
import GameobjectBuilder from './builder/GameobjectBuilder.js';
import AudioManager from './audio/AudioManager.js';
async function start(device: Device) {
	const onmessageHandlers: ((data: WorkerMessage) => void)[] = [];
	device.onmessage = (data) => {
		console.log("message from worker", data);
		onmessageHandlers.forEach(handler => handler(data))
	};
	device.createWorker("dist/worker/index.js");

	device.sendmessage && device.sendmessage({
		type: "hello",
		data: void (0)
	});
	const context = device.getContext();
	const input = new Input(device);
	const camera = new Camera();
	const clock = new Clock(device);
	const map = await new TiledMapBuilder()
		.load(device).then(builder => builder.parse().build());
	camera.setPositionFromTiled(map);
	const gameobjectBuilder = new GameobjectBuilder()
		.setContext(context)
		.setFontCanvasContext(device.getContext2d());
	const builder =  new SceneBuilder();
	const scene = await builder
		.initTiledMap(map, gameobjectBuilder)
		.load(device)
		.then(builder => builder.init().build());
	const islandScene = await builder
		.initIsland(gameobjectBuilder)
		.load(device)
		.then(builder => builder.init().build());
	new CommandInvoker()
		.setCamera(camera)
		.setHandlers(onmessageHandlers)
		.setScene(scene)
		.setSendMessage(device.sendmessage?.bind(device))
		.setInput(input)
		.setup()
		.prepareSend({
			type: "initTileMap",
			data: map
		}).build();

	new AudioManager();
	function tick() {
		clock.tick();
		input.update();
		const now = clock.now;
		const delta = clock.delta;
		const windowInfo = device.getWindowInfo();
		context.viewport(0, 0, ...windowInfo);
		context.scissor(0, 0, ...windowInfo);
		context.clearColor(0.3, 0.3, 0.3, 1);
		context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
		camera.updateWindowInfo(...windowInfo)
		camera.update(now, delta);
		scene.updateCamera(camera);
		scene.update(now, delta);
		scene.render();
		context.viewport(0, 0, 1024, 1024);
		context.scissor(0, 0, 1024, 1024);
		context.clearColor(0.3, 0.3, 0.3, 1);
		context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
		islandScene.render();
		requestAnimationFrame(tick);
	}
	tick();
}

async function mainH5() {
	const BrowserDevice = (await import("./device/BrowserDevice")).default;
	const device = new BrowserDevice();
	new EventSource('/esbuild').addEventListener('change', () => location.reload())
	return device;
}


async function mainMinigame() {
	const MinigameDevice = (await import("./device/MinigameDevice")).default;
	const device = new MinigameDevice();
	await device.loadSubpackage();
	return device;
}
export {
	start,
	mainH5,
	mainMinigame
}
