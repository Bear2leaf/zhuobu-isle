import Device from './device/Device';
import { vec4 } from 'gl-matrix';
import Input from './input/Input';
import Character from './drawobject/Character';
import Tilemap from './drawobject/Tilemap';
import Drawobject from './drawobject/Drawobject';
import Camera from './camera/Camera';
async function start(device: Device) {
	device.onmessage = (data) => {
		console.log("message from worker", data);
		for (const drawobject of drawobjects) {
			drawobject.onmessage(data);	
		} 
	};
	device.createWorker("dist/worker/index.js");
	const context = device.getContext();
	const input = new Input(device);
	const camera = new Camera();
	const drawobjects: Drawobject[] = [];
	drawobjects.push(new Tilemap(context));
	drawobjects.push(new Character(context));
	for await (const drawobject of drawobjects) {
		await drawobject.load(device);
		drawobject.sendmessage = device.sendmessage?.bind(device);
		drawobject.init();
	}
	input.ondrag = (x, y) => {
		camera.setVelocity(x, y);
	};
	input.onclick = (x, y) => {
		const p = vec4.create()
		camera.screenToWorld(x, y, p);
		for (const drawobject of drawobjects) {
			drawobject.onclick(p[0], p[1]);
		}
	}
	input.onrelease = () => {
		camera.setVelocity(0, 0);
	}
	let last = 0;
	function tick() {
		input.update();
		const now = device.now();
		const delta = now - last;
		last = now;
		const windowInfo = device.getWindowInfo();
		camera.updateWindowInfo(...windowInfo)
		camera.update(now, delta);
		context.viewport(0, 0, ...windowInfo);
		context.scissor(0, 0, ...windowInfo);
		context.clearColor(0.3, 0.3, 0.3, 1);
		context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
		for (const drawobject of drawobjects) {
			camera.updateDrawobject(drawobject);
			drawobject.update(now, delta);
			drawobject.draw();
		}
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