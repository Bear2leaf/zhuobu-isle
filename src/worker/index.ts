import BrowserWorker from "./interface/BrowserWorker";
import MinigameWorker from "./interface/MinigameWorker";
import WorkerInterface from "./interface/WorkerInterface";
import IslandMap from "./map/IslandMap";
import MeshBuilder from "./map/MeshBuilder";
import TriangleMesh from "./map/TriangleMesh";
import PoissonDiskSampling from "./poisson/PoissonDiskSampling";
import SeedableRandom from "./util/SeedableRandom";
import { createNoise2D } from "./util/simplex-noise";

function createIsland() {
    const spacing = 64;
    const distanceRNG = new SeedableRandom(42);
    const simplex = { noise2D: createNoise2D(() => distanceRNG.nextFloat()) };
    const rng = new SeedableRandom(25);
    const map = new IslandMap(new TriangleMesh(new MeshBuilder({ boundarySpacing: spacing }).addPoisson(PoissonDiskSampling, spacing, () => rng.nextFloat()).create()), {
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
let device: WorkerInterface;
if (typeof worker === 'undefined') {
    device = new BrowserWorker();
} else {
    device = new MinigameWorker();
}
device.onmessage = function (data: any) {
    if (data === "hello") {
        device.emit(createIsland().r_biome)
    }
    console.log("message from main", data);
}
export { };