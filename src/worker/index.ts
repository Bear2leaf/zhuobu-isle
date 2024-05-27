import BrowserWorker from "./device/BrowserWorker";
import MinigameWorker from "./device/MinigameWorker";
import WorkerDevice from "./device/WorkerDevice";
import MeshBuilder from "./island/MeshBuilder";
import TriangleMesh from "./island/TriangleMesh";
import astar, { Graph } from "javascript-astar";
import { chunk } from "lodash";
import TiledMap from "../tiled/TiledMap.js";
import { createPlan } from "./goap/core/planner.js";
import { initialState, actions, goals } from "./goap/core/data.js";
import IslandMap from "./island/IslandMap.js";
import Alea from "alea";
import PoissonDiskSampling from "poisson-disk-sampling";
import { createNoise2D } from "simplex-noise"

function createIsland() {
  const spacing = 64;
  const distanceRNG = Alea(42);
  const simplex = { noise2D: createNoise2D(() => distanceRNG.next()) };
  const rng = Alea(25);
  const map = new IslandMap(new TriangleMesh(new MeshBuilder({ boundarySpacing: spacing }).addPoisson(PoissonDiskSampling, spacing, () => rng.next()).create()), {
    amplitude: 0.5,
    length: 4,
  }, () => (N) => Math.round(rng.next() * N));
  map.calculate({
    noise: simplex,
    shape: { round: 0.5, inflate: 0.3, amplitudes: [1 / 4, 1 / 8, 1 / 12, 1 / 16] },
    numRivers: 20,
    drainageSeed: 0,
    riverSeed: 0,
    noisyEdge: { length: 10, amplitude: 0.2, seed: 0 },
    biomeBias: { north_temperature: 0, south_temperature: 0, moisture: 0 },
  });
  return map;
}
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
    device.postmessage({ type: "worker", data: createIsland().r_biome })
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