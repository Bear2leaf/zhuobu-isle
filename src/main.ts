import Device from './device/Device';
import { vec4 } from 'gl-matrix';
import Input from './input/Input';
import Camera from './camera/Camera';
import { update } from '@tweenjs/tween.js';
import TiledScene from './scene/TiledScene';
import Clock from './clock/Clock.js';
async function start(device: Device) {
	device.onmessage = (data) => {
		console.log("message from worker", data);
		scene.onmessage(data);
	};
	device.createWorker("dist/worker/index.js");
	const context = device.getContext();
	const input = new Input(device);
	const camera = new Camera();
	const clock = new Clock(device);
	const scene = new TiledScene(context);
	scene.initEvents(device);
	await scene.load("isle", device);
	scene.init();
	input.init(camera, scene)
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
