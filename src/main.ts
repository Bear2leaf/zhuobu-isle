import Device from './device/Device';
import { mat4 } from 'gl-matrix';


async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage({type: "hello"});
	console.log(mat4.create());
	device.engine.add([
		device.engine.text("oh hi"),
		device.engine.pos(80, 40),
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