import Device from './device/Device';
import { mat4 } from 'gl-matrix';


async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage({ type: "hello" });
	console.log(mat4.create());
	const k = device.engine;
	const text = k.add([
		k.text("oh hi, 你好2👋"),
	])

	k.loadSprite("creatures", "resources/image/creatures.png", {
		sliceX: 8,
		sliceY: 4,
		anims: {
			idle: {
				from: 0,
				to: 7,
				loop: true
			},
			walk: {
				from: 8,
				to: 13,
				loop: true,

			}
		}
	})
	const bg = k.add([
		k.rect(16, 16),
		k.scale(10),
		k.pos(0, 120)
	])
	const joe = k.add([
		k.sprite("creatures", {
			anim: "idle"
		}),
		k.pos(0, 120),
		k.scale(10)
	])
	k.onMouseDown(() => {
		joe.play("walk");
		joe.flipX = true;
	})
	k.onMouseMove((btn) => {
		const mousePos = k.mousePos();
		text.text = `${mousePos.x}, ${mousePos.y}`
		console.log(joe.worldPos().angle(k.toWorld(mousePos)))
	})

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