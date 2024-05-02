import 'minigame-api-typings';

async function mainH5 () {
	const bar = (await import("./bar")).default;
	const foo = (await import("./foo")).default;
	console.log(foo, bar);
}

async function mainMinigame() {
	const bar = (await import("./bar")).default;
	const foo = (await import("./foo")).default;
	console.log(foo, bar);
}
export {
	mainH5,
	mainMinigame
}