import Device from "../../device/Device.js";
import IslandFramebuffer from "../../framebuffer/IslandFramebuffer.js";
import IslandMap from "../../island/IslandMap.js";
import MeshBuilder from "../../island/MeshBuilder.js";
import TriangleMesh from "../../island/TriangleMesh.js";
import Drawable from "./Drawable.js";

import Alea from "alea";
import PoissonDiskSampling from "poisson-disk-sampling";
import { createNoise2D } from "simplex-noise"

function createIsland() {
  const spacing = 32;
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
export default class Island extends Drawable {
    private framebuffer?: IslandFramebuffer;
    private readonly islandMap: IslandMap = createIsland();

    initRenderer(context: WebGL2RenderingContext): void {
        super.initRenderer(context);
        this.framebuffer = new IslandFramebuffer(context);
        console.log(this.islandMap);
    }
    async load(device: Device): Promise<void> {
        await this.renderer?.loadShaderSource(device);
        await this.feedback?.loadShaderSource(device);
        await this.framebuffer?.loadShaderSource(device);
        await this.renderer?.loadTextureSource(device, "")
        const texture = this.renderer?.handler.texture;
        if (!texture) {
            throw new Error("texture is undefined")
        }
        await this.framebuffer?.loadTextureSource(device, texture);
    }
    init(): void {
        const buffer = [
            -1, -1, 0, 1, 0.5, 1,
            1, -1, 0, 1, 0.5, 1,
            1, 1, 0, 1, 0.5, 1,
            1, 1, 0, 1, 0.5, 1,
            -1, 1, 0, 1, 0.5, 1,
            -1, -1, 0, 1, 0.5, 1,
        ]
        const bufferSprite = [
            0, -1, -1, 0, 0, 0, 0, 1024, 1024,
            0, 1, -1, 1, 0, 0, 0, 1024, 1024,
            0, 1, 1, 1, 1, 0, 0, 1024, 1024,
            0, 1, 1, 1, 1, 0, 0, 1024, 1024,
            0, -1, 1, 0, 1, 0, 0, 1024, 1024,
            0, -1, -1, 0, 0, 0, 0, 1024, 1024,
        ]
        this.framebuffer?.initVAO(buffer.length / 6);
        this.framebuffer?.updateBuffer(0, buffer);
        this.renderer?.initVAO(bufferSprite.length / 9);
        this.renderer?.updateBuffer(0, bufferSprite);
    }
    draw(): void {
        this.framebuffer?.bind();
        this.framebuffer?.render();
        this.framebuffer?.unbind();
        this.renderer?.render();
    }
}