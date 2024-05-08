import Device from './device/Device';
import { vec4 } from 'gl-matrix';
import Input from './input/Input';
import Camera from './camera/Camera';
import { update } from '@tweenjs/tween.js';
import TiledMap from './map/TiledMap';
async function start(device: Device) {
	device.onmessage = (data) => {
		console.log("message from worker", data);
		world.onmessage(data);
	};
	device.createWorker("dist/worker/index.js");
	const context = device.getContext();
	const input = new Input(device);
	const camera = new Camera();
	const world = new TiledMap(context);
	device.sendmessage && world.setSendMessage(device.sendmessage.bind(device));
	await world.load("world", device);
	world.init();
	input.ondrag = (x, y) => {
		camera.ondrag(x, y);
	};
	input.onclick = (x, y) => {
		const p = vec4.create()
		camera.screenToWorld(x, y, p);
		world.onclick(p[0], p[1]);
	}
	input.onrelease = () => {
		camera.ondrag(0, 0);
	}
	let last = 0;
	function tick() {
		input.update();
		const now = device.now();
		const delta = now - last;
		last = now;
		update(now);
		const windowInfo = device.getWindowInfo();
		camera.updateWindowInfo(...windowInfo)
		camera.update(now, delta);
		context.viewport(0, 0, ...windowInfo);
		context.scissor(0, 0, ...windowInfo);
		context.clearColor(0.3, 0.3, 0.3, 1);
		context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
		world.updateCamera(camera);
		world.update(now, delta);
		world.render();
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