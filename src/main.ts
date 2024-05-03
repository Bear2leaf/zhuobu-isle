import kaboom from 'kaboom';
import Device from './device/Device';
import { mat4 } from 'gl-matrix';


async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage("hello");
	console.log(mat4.create());
	// const renderer = new Renderer(device.contextGL);
	// await renderer.loadShaderSource(device);
	// renderer.initVAO()
	// function loop() {
	// 	renderer.prepare([0, 0, ...device.getWindowInfo()], [0.4, 0.4, 0.3, 1])
	// 	renderer.render()
	// 	requestAnimationFrame(() => {
	// 		loop();
	// 	})
	// }
	// loop();
	console.log(device.canvasGL)
	const kb =kaboom({
		canvas: device.canvasGL,
		global: false,
		background: '#3a3a3a'
	});
	kb.add([
		kb.text("oh hi"),
		kb.pos(80, 40),
	])
}



async function mainH5() {
	const BrowserDevice = (await import("./device/BrowserDevice")).default;
	const device = new BrowserDevice();
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