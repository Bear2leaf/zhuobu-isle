import 'minigame-api-typings';
const WORKER_URL = "dist/worker/index.js";
async function mainH5() {
	const BrowserDevice = (await import("./device/BrowserDevice")).default;
	const canvasGL = document.createElement("canvas");
	const canvas2D =document.createElement("canvas");
	document.body.appendChild(canvasGL);
	document.body.appendChild(canvas2D);
	const device = new BrowserDevice(
		canvasGL,
		canvas2D
	);
	device.createWorker(WORKER_URL, console.log);
}

async function mainMinigame() {
	const MinigameDevice = (await import("./device/MinigameDevice")).default;
	const device = new MinigameDevice();
	device.createWorker(WORKER_URL, console.log);
}
export {
	mainH5,
	mainMinigame
}