import { createPlan } from "./goap/planner";
import BrowserWorker from "./device/BrowserWorker";
import MinigameWorker from "./device/MinigameWorker";
import WorkerDevice from "./device/WorkerDevice";
import Island from "./island/Island";
import MeshBuilder from "./island/MeshBuilder";
import TriangleMesh from "./island/TriangleMesh";
import PoissonDiskSampling from "./poisson/PoissonDiskSampling";
import SeedableRandom from "./util/SeedableRandom";
import { createNoise2D } from "./util/simplex-noise";
import { actions, goal, initialState } from "./goap/data";
import astar, { Graph } from "javascript-astar";
import { chunk } from "lodash";
import { AnyLayer, Map, UnencodedTileLayer } from "@kayahr/tiled";

function createIsland() {
  const spacing = 64;
  const distanceRNG = new SeedableRandom(42);
  const simplex = { noise2D: createNoise2D(() => distanceRNG.nextFloat()) };
  const rng = new SeedableRandom(25);
  const map = new Island(new TriangleMesh(new MeshBuilder({ boundarySpacing: spacing }).addPoisson(PoissonDiskSampling, spacing, () => rng.nextFloat()).create()), {
    amplitude: 0.5,
    length: 4,
  }, () => (N) => Math.round(rng.nextFloat() * N));
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
let tiled: Map;
let graph: Graph;
device.onmessage = function (message) {
  if (message.type === "hello") {
    device.postmessage({ type: "worker", data: createIsland().r_biome })
  } else if (message.type === "initTileMap") {
    tiled = message.data as Map;
    const firstLayer = tiled.layers[0] as UnencodedTileLayer;
    graph = new astar.Graph(chunk(firstLayer.data, tiled.width));
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
    console.log(createPlan(initialState, actions, goal))
  }
  console.log("message from main", message);
}
export { };