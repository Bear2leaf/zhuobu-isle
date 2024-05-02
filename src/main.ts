import 'minigame-api-typings';
import Renderer from './Renderer';
import Device from './device/Device';


async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.emit("hello");
	const renderer = new Renderer(device.contextGL);
	await renderer.loadShaderSource(device);
	renderer.initVAO()
	function loop() {
		renderer.prepare([0, 0, ...device.getWindowInfo()], [0.3, 0.3, 0.3, 1])
		renderer.render()
		requestAnimationFrame(() => {
			loop();
		})
	}
	loop();
}



async function mainH5() {
	const BrowserDevice = (await import("./device/BrowserDevice")).default;
	const canvasGL = document.createElement("canvas");
	const canvas2D = document.createElement("canvas");
	document.body.appendChild(canvasGL);
	document.body.appendChild(canvas2D);
	const device = new BrowserDevice(
		canvasGL,
		canvas2D
	);
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