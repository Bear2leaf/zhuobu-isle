import BrowserWorker from "./device/BrowserWorker";
import MinigameWorker from "./device/MinigameWorker";
import WorkerDevice from "./device/WorkerDevice";
import astar, { Graph } from "javascript-astar";
import { chunk } from "lodash";
import TiledMap from "../tiled/TiledMap.js";
import { createPlan } from "./goap/core/planner.js";
import { initialState, actions, goals } from "./goap/core/data.js";
declare const worker: WechatMinigame.Worker;
let device: WorkerDevice;
if (typeof worker === 'undefined') {
  device = new BrowserWorker();
} else {
  device = new MinigameWorker();
}
let tiled: TiledMap;
let graph: Graph;
device.onmessage = function (message) {
  if (message.type === "hello") {
  } else if (message.type === "initTileMap") {
    tiled = new TiledMap(
      message.data.tilesets,
      message.data.layers,
      message.data.width,
      message.data.height,
      message.data.tilewidth,
      message.data.tileheight,
    )
    const firstLayer = tiled.getLayers()[0];
    graph = new astar.Graph(chunk(firstLayer.data, tiled.getWidth()));
  } else if (message.type === "findPath") {
    const startX = message.data.start[0];
    const startY = message.data.start[1];
    const endX = message.data.end[0];
    const endY = message.data.end[1];
    const start = graph.grid[startY][startX];
    const end = graph.grid[endY][endX];
    const result = astar.astar.search(graph, start, end)
    device.postmessage({ type: "path", data: result.map(p => [p.y, p.x]) })
  } else if (message.type === "plan") {
    console.log(createPlan(initialState, actions, goals[0]))
  }
  console.log("message from main", message);
}
export { };