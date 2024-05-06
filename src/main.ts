import Device from './device/Device';
import { mat3, mat4, vec2, vec3, vec4 } from 'gl-matrix';
import SpriteRenderer from './renderer/SpriteRenderer.ts';
import SpriteFeedback from './feedback/SpriteFeedback.ts';
import Input from './input/Input.ts';

async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage({ type: "hello" });
	const context = device.getContext();
	const input = new Input(device);
	const renderer = new SpriteRenderer(context);
	await renderer.loadShaderSource(device);
	await renderer.loadTextureSource(device);
	renderer.initVAO(6);
	const feedback = new SpriteFeedback(context, renderer.getTarget());
	await feedback.loadShaderSource(device)
	await feedback.loadTextureSource(device)
	feedback.initVAO(6);
	feedback.updateBuffer(0, [
		0, -100, -100, 0, 0,
		0, 100, -100, 16 , 0,
		0, 100, 100, 16 , 16,
		0, 100, 100, 16 , 16,
		0, -100, 100, 0, 16,
		0, -100, -100, 0, 0
	]);
	const projection = mat4.create();
	const view = mat4.create();
	const windowInfo = device.getWindowInfo();
	mat4.ortho(projection, 0, windowInfo[0], windowInfo[1], 0, 1, -1);
	const cameraPos = vec2.create();
	const position = vec2.create();
	const velocity = vec2.create();
	const model = mat4.create();
	mat4.identity(model);
	input.ondrag = (x, y) => {
		velocity[0] = x;
		velocity[1] = -y;
	};
	input.onclick = (x, y) => {
		const position = vec4.fromValues(x, y, 0, 1);
		const windowInfo = device.getWindowInfo();
		const invertModel = mat4.create();
		mat4.invert(invertModel, model);
		const invertView = mat4.create();
		mat4.invert(invertView, view);
		const invertProjection = mat4.create();
		mat4.invert(invertProjection, projection);
		const invert = mat4.create();
		mat4.mul(invert, invert, invertProjection);
		mat4.mul(invert, invert, invertView);
		mat4.mul(invert, invert, invertModel);
		vec4.transformMat4(position, position, invert);
		const worldPosition = vec2.fromValues(position[0] / windowInfo[0], -position[1] / windowInfo[1])
		console.log(`clicked: screen->[${x},${y}], world->[${worldPosition.join(",")}]`);
	}
	input.onrelease = () => {
		velocity[0] = 0;
		velocity[1] = 0;
	}
	renderer.updateProjection(projection);
	function tick() {
		input.update();
		cameraPos[0] += velocity[0];
		cameraPos[1] += velocity[1];
		mat4.fromTranslation(model, vec3.fromValues(position[0], position[1], 0))
		renderer.updateModel(model);
		mat4.lookAt(view, vec3.fromValues(cameraPos[0], cameraPos[1], 1), vec3.fromValues(cameraPos[0], cameraPos[1], 0), vec3.fromValues(0, 1, 0));
		mat4.invert(view, view);
		renderer.updateView(view);
		feedback.updateDelta(device);
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