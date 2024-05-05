import Device from './device/Device';
import { mat4 } from 'gl-matrix';


async function start(device: Device) {
	device.onmessage = (data) => console.log("message from worker", data);
	device.createWorker("dist/worker/index.js");
	device.sendmessage({ type: "hello" });
	console.log(mat4.create());
	const k = device.engine;
	const text = k.add([
		k.text("oh hi, 你好👋"),
	])
	function createSpriteFrames(frames: [number, number][]) {
		const tilewidth = 272;
		const tileheight = 256;
		const tilesx = 16;
		const tilesy = 32;
		const walkdown = frames.map(([x, y]) => new k.Quad(
			x * tilesx / tilewidth, y * tilesy / tileheight,
			tilesx / tilewidth, tilesy / tileheight
		));
		return walkdown;
	}
	const walkdown = createSpriteFrames([
		[0, 0],
		[1, 0],
		[2, 0],
		[3, 0]
	]);
	const walkright = createSpriteFrames([
		[0, 1],
		[1, 1],
		[2, 1],
		[3, 1]
	]);
	const walkup = createSpriteFrames([
		[0, 2],
		[1, 2],
		[2, 2],
		[3, 2]
	]);
	const walkleft = createSpriteFrames([
		[0, 3],
		[1, 3],
		[2, 3],
		[3, 3]
	]);
	k.loadSprite("creatures", "resources/image/gfx/character.png", {
		frames: [
			...walkdown,
			...walkright,
			...walkup,
			...walkleft
		],
		anims: {
			idle: {
				from: 0,
				to: 0,
				loop: true
			},
			walkright: {
				from: 4,
				to: 7,
				loop: true,
			},
			walkdown: {
				from: 0,
				to: 3,
				loop: true,
			},
			walkup: {
				from: 8,
				to: 11,
				loop: true,
			},
			walkleft: {
				from: 12,
				to: 15,
				loop: true,
			}
		}
	})
	const level = k.addLevel([
		"asd",
		"fff",
	], {
		tileHeight: 16,
		tileWidth: 16,
		tiles: {},
		wildcardTile: (sym, pos) => {
			return [
				k.rect(16, 16),
				k.outline(2, k.Color.BLUE)
			]
		}
	})
	const bg = k.add([
		k.rect(16, 32),
		k.scale(10),
		k.pos(120, 120)
	])
	const joe = k.add([
		k.sprite("creatures", {
			anim: "idle"
		}),
		k.pos(120, 120),
		k.scale(10)
	])

	k.onMouseMove((btn) => {
		const mousePos = k.mousePos();
		text.text = `${mousePos.x}, ${mousePos.y}`

	})
	k.onKeyDown("right", () => joe.curAnim() !== "walkright" && joe.play("walkright"))
	k.onKeyDown("down", () => joe.curAnim() !== "walkdown" && joe.play("walkdown"))
	k.onKeyDown("up", () => joe.curAnim() !== "walkup" && joe.play("walkup"))
	k.onKeyDown("left", () => joe.curAnim() !== "walkleft" && joe.play("walkleft"))

	k.onKeyRelease("right", () => joe.stop())
	k.onKeyRelease("down", () => joe.stop())
	k.onKeyRelease("up", () => joe.stop())
	k.onKeyRelease("left", () => joe.stop())


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