import Device from './device/Device';
import { mat3, mat4, vec2, vec3, vec4 } from 'gl-matrix';
import Input from './input/Input';
import Character from './drawobject/Character';
import Tilemap from './drawobject/Tilemap';
import Drawobject from './drawobject/Drawobject';
async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage && device.sendmessage({ type: "hello" });
	const context = device.getContext();
	const input = new Input(device);
	const drawobjects: Drawobject[] = [];
	drawobjects.push(new Tilemap(context));
	drawobjects.push(new Character(context));
	for await (const drawobject of drawobjects) {
		await drawobject.load(device);
		drawobject.init();
	}
	const projection = mat4.create();
	const view = mat4.create();
	const windowInfo = device.getWindowInfo();
	mat4.ortho(projection, 0, windowInfo[0], windowInfo[1], 0, 1, -1);
	const cameraPos = vec2.create();
	const velocity = vec2.create();
	const model = mat4.create();
	mat4.scale(model, model, vec3.fromValues(100, 100, 1))
	input.ondrag = (x, y) => {
		velocity[0] = x;
		velocity[1] = -y;
	};
	input.onclick = (x, y) => {
		const p = vec4.fromValues(x / windowInfo[0], y / windowInfo[1], 0, 1);
		vec4.sub(p, vec4.mul(p, p, vec4.fromValues(2, 2, 0, 1)), vec4.fromValues(1, 1, 0, 0));
		p[1] = -p[1];
		vec4.transformMat4(p, p, mat4.invert(mat4.create(), projection));
		vec4.transformMat4(p, p, view);
		vec4.transformMat4(p, p, mat4.invert(mat4.create(), model));
		console.log(`clicked: screen->[${x},${y}], p-> ${p.join(",")}`);
		for (const drawobject of drawobjects) {
			drawobject.onclick(p[0], p[1]);
		}
	}
	input.onrelease = () => {
		velocity[0] = 0;
		velocity[1] = 0;
	}
	let last = 0;
	function tick() {
		input.update();
		cameraPos[0] += velocity[0];
		cameraPos[1] += velocity[1];
		mat4.lookAt(view, vec3.fromValues(cameraPos[0], cameraPos[1], 1), vec3.fromValues(cameraPos[0], cameraPos[1], 0), vec3.fromValues(0, 1, 0));
		const invert = mat4.create();
		mat4.invert(invert, view);
		const now = device.now();
		const delta = now - last;
		last = now;
		context.viewport(0, 0, ...device.getWindowInfo());
		context.scissor(0, 0, ...device.getWindowInfo());
		context.clearColor(0.3, 0.3, 0.3, 1);
		context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
		for (const drawobject of drawobjects) {
			drawobject.updateProjection(projection);
			drawobject.updateModel(model);
			drawobject.updateView(invert);
			drawobject.update(device.now(), delta);
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