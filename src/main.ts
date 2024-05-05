import Renderer from './renderer/Renderer.ts';
import Device from './device/Device';
import { mat4 } from 'gl-matrix';
import ImageRenderer from './renderer/ImageRenderer.ts';
import SpriteRenderer from './renderer/SpriteRenderer.ts';
import SpriteFeedback from './feedback/SpriteFeedback.ts';

async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage({ type: "hello" });
	console.log(mat4.create());
	const context = device.getContext();
	const renderer = new SpriteRenderer(context);
	await renderer.loadShaderSource(device);
	await renderer.loadTextureSource(device);
	renderer.initVAO();
	const feedback = new SpriteFeedback(context, renderer.getTarget());
	await feedback.loadShaderSource(device)
	await feedback.loadTextureSource(device)
	feedback.initVAO();
	function tick() {
		renderer.prepare([0, 0, ...device.getWindowInfo()], [0.3, 0.3, 0.3, 1]);
		feedback.render();
		renderer.render();
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