import BrowserWorker from "./device/BrowserWorker";
import MinigameWorker from "./device/MinigameWorker";
import WorkerDevice from "./device/WorkerDevice";
import astar, { Graph } from "javascript-astar";
import { chunk } from "lodash";
import Tilemap from "../tiled/Tilemap.js";
import { createPlan } from "./goap/core/planner.js";
import { initialState, actions, goals, ITEM_DATA } from "./goap/core/data.js";
import { EmbeddedTileset } from "@kayahr/tiled";
import Alea from "alea";
import { generateStone, initLayers } from "./goap/core/world.js";
import ConsoleAgent from "./goap/agent/ConsoleAgent.js";
import AgentView from "./goap/view/AgentView.js";
import WorldView from "./goap/view/WorldView.js";
declare const worker: WechatMinigame.Worker;
let device: WorkerDevice;
if (typeof worker === 'undefined') {
  device = new BrowserWorker();
} else {
  device = new MinigameWorker();
}
let tiled: Tilemap;
let graph: Graph;
device.onmessage = function (message) {
  console.log("message from main", message);
  if (message.type === "hello") {
  } else if (message.type === "initTileMap") {
    tiled = new Tilemap(
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
  } else if (message.type === "initIslandData") {
    const biomeFields = message.data.conners;
    const BiomeColor = message.data.biomeColors;
    const configToTile = tiled.getTilesets().reduce<Record<string, number[]>>((prev: Record<string, number[]>, current: EmbeddedTileset) => {
      if (!current.wangsets) {
        return prev;
      }
      for (const wangset of current.wangsets) {
        for (const wangtile of wangset.wangtiles) {
          const config = wangset.colors[wangtile.wangid[1] + wangset.tile].name.toUpperCase()
            + "-" + wangset.colors[wangtile.wangid[3] + wangset.tile].name.toUpperCase()
            + "-" + wangset.colors[wangtile.wangid[5] + wangset.tile].name.toUpperCase()
            + "-" + wangset.colors[wangtile.wangid[7] + wangset.tile].name.toUpperCase()
          if (prev[config] === undefined) {
            prev[config] = [];
          }
          prev[config].push(wangtile.tileid);
        }
      }
      return prev;
    }, {});
    const gridsX = tiled.getWidth();
    const gridsY = tiled.getHeight();
    const grid: number[][] = new Array(gridsY).fill([])
    grid.forEach((col, i, arr) => arr[i] = new Array(gridsX).fill(0));
    const objectGrid: number[][] = new Array(gridsY).fill([])
    objectGrid.forEach((col, i, arr) => arr[i] = new Array(gridsX).fill(pick(ITEM_DATA.Transparent)));
    for (let i = 0; i < gridsY; i++) {
      for (let j = 0; j < gridsX; j++) {
        const tr = biomeFields[i][j + 1];
        const rb = biomeFields[i + 1][j + 1];
        const bl = biomeFields[i + 1][j];
        const lt = biomeFields[i][j];
        const trKey = BiomeColor[tr];
        const blKey = BiomeColor[bl];
        const rbKey = BiomeColor[rb];
        const ltKey = BiomeColor[lt];
        const config = `${trKey}-${rbKey}-${blKey}-${ltKey}`;
        grid[i][j] = pick(configToTile[config]);
      }
    }
    device.postmessage({ type: "updateLayer", data: grid })
    initLayers(grid, objectGrid)
    const agent = new ConsoleAgent();
    const viewer = new AgentView(agent);
    const worldViewer = new WorldView(agent);
    for (let index = 0; index < 5; index++) {
        generateStone({x: 32, y: 32});
    }
    setInterval(() => {
        // console.clear();
        // worldViewer.update();
        agent.update();
        // viewer.update();
    }, 20);
    
  }
}
const rnd = Alea(666);
function pick<T>(choices: T[]): T {
  return choices[Math.floor(choices.length * rnd.next())];
}
export { };