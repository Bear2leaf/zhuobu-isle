import Device from './device/Device';
import Input from './input/Input';
import Camera from './camera/Camera';
import { update } from '@tweenjs/tween.js';
import Clock from './clock/Clock.js';
import { Map } from '@kayahr/tiled';
import SceneBuilder from './builder/SceneBuilder.js';
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
	const tiledMapData = await device.readJson(`resources/tiled/isle.json`) as Map;
	const scene = await new SceneBuilder()
		.setTiledMapData(tiledMapData)
		.initContext(context)
		.setupCommands(onmessageHandlers, device.sendmessage?.bind(device))
		.load(device)
		.then(builder => builder.init().build());
	input.setupCommands(camera, scene, device.sendmessage?.bind(device))
	function tick() {
		clock.tick();
		input.update();
		const now = clock.now;
		const delta = clock.delta;
		update(now);
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
