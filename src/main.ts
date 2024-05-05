import Renderer from './Renderer.ts';
import Device from './device/Device';
import { mat4 } from 'gl-matrix';

async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage({ type: "hello" });
	console.log(mat4.create());
	const renderer = new Renderer(device.getContext());
	await renderer.loadShaderSource(device);
	renderer.initVAO();
	renderer.prepare([0, 0, ...device.getWindowInfo()], [0.3, 0.3, 0.3, 1]);
	renderer.render();
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