import Device from './device/Device';
import { mat4 } from 'gl-matrix';


async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage({type: "hello"});
	console.log(mat4.create());
	const text = device.engine.add([
		device.engine.text("oh hi, 你好👋"),
		device.engine.pos(0, 120),
	])
	device.engine.onTouchStart((n) => text.text = `${n.x}, ${n.y}`)

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