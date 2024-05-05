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
	k.loadSprite("buttons", "resources/image/button/arcade_button.png", {
		sliceX: 8,
		sliceY: 6
	});
	k.loadSprite("planer", "resources/image/gfx/character.png", {
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
				loop: true,
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
		"aaaaaaaaaaa",
		"bbbbbbbbbbb",
		"aaaaaaaaaaa",
		"bbbbbbbbbbb",
		"aaaaaaaaaaa",
		"bbbbbbbbbbb",
		"aaaaaaaaaaa",
		"bbbbbbbbbbb",
	], {
		tileHeight: 16,
		tileWidth: 16,
		tiles: {},
		wildcardTile: (sym, pos) => {
			return [
				k.rect(16, 16),
			]
		}
	})
	const joe = k.add([
		k.sprite("planer", {
			anim: "idle"
		}),
		k.pos(),
	])
	const btnUp = k.add([
		k.sprite("buttons", {
			frame: 0,
		}),
		k.pos(),
		k.follow(joe, k.vec2(0, 50)),
		k.area(),
		k.anchor("center"),
	])
	const btnRight = k.add([
		k.sprite("buttons", {
			frame: 2,
		}),
		k.pos(),
		k.follow(joe, k.vec2(48, 96)),
		k.area(),
		k.anchor("center"),
	])
	const btnDown = k.add([
		k.sprite("buttons", {
			frame: 4,
		}),
		k.pos(),
		k.follow(joe, k.vec2(0, 96)),
		k.area(),
		k.anchor("center"),
	])
	const btnLeft = k.add([
		k.sprite("buttons", {
			frame: 6,
		}),
		k.pos(),
		k.follow(joe, k.vec2(-48, 96)),
		k.area(),
		k.anchor("center"),
	])
	joe.onUpdate(() => {
		k.camPos(joe.pos)
		switch (joe.curAnim()) {
			case "walkdown":
				joeAction(joe, "down");
				break;
			case "walkup":
				joeAction(joe, "up");
				break;
			case "walkleft":
				joeAction(joe, "left");
				break;
			case "walkright":
				joeAction(joe, "right");
				break;
			default:
				;
		}
	});
	btnUp.onClick(() => {
		joeAction(joe, "up");
	})
	btnDown.onClick(() => {
		joeAction(joe, "down");
	})
	btnLeft.onClick(() => {
		joeAction(joe, "left");
	})
	btnRight.onClick(() => {
		joeAction(joe, "right");
	})
	k.onKeyDown("right", () => {
		joeAction(joe, "right");
	})
	k.onKeyDown("down", () => {
		joeAction(joe, "down");

	})
	k.onKeyDown("up", () => {
		joeAction(joe, "up");

	})
	k.onKeyDown("left", () => {
		joeAction(joe, "left");

	})
	btnDown.onMouseRelease(() => joe.stop());
	btnLeft.onMouseRelease(() => joe.stop());
	btnRight.onMouseRelease(() => joe.stop());
	btnUp.onMouseRelease(() => joe.stop());
	k.onKeyRelease("right", () => joe.stop())
	k.onKeyRelease("down", () => joe.stop())
	k.onKeyRelease("up", () => joe.stop())
	k.onKeyRelease("left", () => joe.stop())


}

function joeAction(joe, action: "right" | "down" | "left" | "up") {
	const speed = 100;
	switch (action) {
		case "right":
			if (joe.curAnim() !== "walkright") {
				joe.play("walkright");
			}
			joe.move(speed, 0);
			break;
		case "down":
			if (joe.curAnim() !== "walkdown") {
				joe.play("walkdown");
			}
			joe.move(0, speed);
			break;
		case "left":
			if (joe.curAnim() !== "walkleft") {
				joe.play("walkleft");
			}
			joe.move(-speed, 0);
			break;
		case "up":
			if (joe.curAnim() !== "walkup") {
				joe.play("walkup");
			}
			joe.move(0, -speed);
			break;
		default:
	}
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