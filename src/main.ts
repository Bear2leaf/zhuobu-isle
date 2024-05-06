import Device from './device/Device';
import { mat3, mat4, vec2, vec3, vec4 } from 'gl-matrix';
import SpriteRenderer from './renderer/SpriteRenderer.ts';
import SpriteFeedback from './feedback/SpriteFeedback.ts';
import Input from './input/Input.ts';
async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage({ type: "hello" });
	const tilemap = await device.readJson("resources/json/overworld.json") as any;
	const context = device.getContext();
	const input = new Input(device);
	const characterRenderer = new SpriteRenderer(context);
	await characterRenderer.loadShaderSource(device);
	await characterRenderer.loadTextureSource(device, "character");
	const renderer = new SpriteRenderer(context);
	await renderer.loadShaderSource(device);
	await renderer.loadTextureSource(device, "Overworld");
	const layers = tilemap.layers;
	const buffer: number[] = [];
	for (let k = 0; k < layers.length; k++) {
		const layer = layers[k];
		const data = layer.data;
		const width = layer.width;
		const height = layer.height;
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				const element = data[i * width + j] - 1;
				if (element < 0) {
					continue;
				}
				buffer.push(
					0, 0 + j, 0 + i, 0, 0, element, element, 16, 16,
					0, 1 + j, 0 + i, 1, 0, element, element, 16, 16,
					0, 1 + j, 1 + i, 1, 1, element, element, 16, 16,
					0, 1 + j, 1 + i, 1, 1, element, element, 16, 16,
					0, 0 + j, 1 + i, 0, 1, element, element, 16, 16,
					0, 0 + j, 0 + i, 0, 0, element, element, 16, 16,
				)
			}
		}
	}
	console.log(tilemap)
	renderer.initVAO(buffer.length / 9);
	const feedback = new SpriteFeedback(context, renderer.getTarget());
	await feedback.loadShaderSource(device)
	characterRenderer.initVAO(6);
	const characterFeedback = new SpriteFeedback(context, characterRenderer.getTarget());
	await characterFeedback.loadShaderSource(device)
	characterFeedback.initVAO(6);
	characterFeedback.updateBuffer(0, [
		0, 0, 0, 0, 0, 0, 3, 16, 32,
		0, 1, 0, 1, 0, 0, 3, 16, 32,
		0, 1, 2, 1, 1, 0, 3, 16, 32,
		0, 1, 2, 1, 1, 0, 3, 16, 32,
		0, 0, 2, 0, 1, 0, 3, 16, 32,
		0, 0, 0, 0, 0, 0, 3, 16, 32,
	])
	feedback.initVAO(buffer.length / 9);
	feedback.updateBuffer(0, buffer);
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
		const position = vec4.create();
		const p = vec4.fromValues(x / windowInfo[0], y / windowInfo[1], 0, 1);
		vec4.sub(p, vec4.mul(p, p, vec4.fromValues(2, 2, 0, 1)), vec4.fromValues(1, 1, 0, 0));
		p[1] = -p[1];
		vec4.transformMat4(p, p, mat4.invert(mat4.create(), projection));
		vec4.transformMat4(p, p, view);
		vec4.transformMat4(p, p, mat4.invert(mat4.create(), model));
		console.log(`clicked: screen->[${x},${y}], p-> ${p.join(",")}, world->[${position[0]}, ${position[1]}]`);
	}
	input.onrelease = () => {
		velocity[0] = 0;
		velocity[1] = 0;
	}
	renderer.updateProjection(projection);
	characterRenderer.updateProjection(projection);
	function tick() {
		input.update();
		cameraPos[0] += velocity[0];
		cameraPos[1] += velocity[1];
		renderer.updateModel(model);
		characterRenderer.updateModel(model);
		mat4.lookAt(view, vec3.fromValues(cameraPos[0], cameraPos[1], 1), vec3.fromValues(cameraPos[0], cameraPos[1], 0), vec3.fromValues(0, 1, 0));
		const invert = mat4.create();
		mat4.invert(invert, view);
		renderer.updateView(invert);
		characterRenderer.updateView(invert);
		feedback.updateDelta(device);
		characterFeedback.updateDelta(device);
		renderer.prepare([0, 0, ...device.getWindowInfo()], [0.3, 0.3, 0.3, 1]);
		feedback.render();
		renderer.render();
		characterFeedback.render();
		characterRenderer.render();
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