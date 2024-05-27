import Device from "../../device/Device.js";
import IslandFramebuffer from "../../framebuffer/IslandFramebuffer.js";
import IslandMap from "../../island/IslandMap.js";
import MeshBuilder from "../../island/MeshBuilder.js";
import TriangleMesh from "../../island/TriangleMesh.js";
import Drawable from "./Drawable.js";

import Alea from "alea";
import PoissonDiskSampling from "poisson-disk-sampling";
import { createNoise2D } from "simplex-noise"
import { BiomeColor } from "../../island/biomes.js";
import ImageRenderer from "../../renderer/ImageRenderer.js";

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
        this.renderer = new ImageRenderer(context);
        this.framebuffer = new IslandFramebuffer(context);
    }
    update(elapsed: number, delta: number) {
    }
    async load(device: Device): Promise<void> {
        await this.renderer?.loadShaderSource(device);
        await this.framebuffer?.loadShaderSource(device);
        await this.renderer?.loadTextureSource(device, "")
        const texture = this.renderer?.handler.texture;
        if (!texture) {
            throw new Error("texture is undefined")
        }
        await this.framebuffer?.loadTextureSource(device, texture);
    }
    private adjustXY(x: number) {
        return x / 500 - 1;
    }
    private adjustHeight(height: number) {
        return height / 8;
    }
    init(): void {
        const map = this.islandMap;
        const buffer: number[] = [
        ]
        for (let s = 0; s < map.mesh.numSolidSides; s++) {
            const r = map.mesh.s_begin_r(s),
                t1 = map.mesh.s_inner_t(s),
                t2 = map.mesh.s_outer_t(s);
            const color: BiomeColor = map.r_biome[r];
            const pos1: [number, number] = [0, 0];
            const pos2: [number, number] = [0, 0];
            const pos3: [number, number] = [0, 0];
            map.mesh.r_pos(pos1, r);
            map.mesh.t_pos(pos2, t1);
            map.mesh.t_pos(pos3, t2);
            pos1[0] = this.adjustXY(pos1[0]);
            pos1[1] = this.adjustXY(pos1[1]);
            pos2[0] = this.adjustXY(pos2[0]);
            pos2[1] = this.adjustXY(pos2[1]);
            pos3[0] = this.adjustXY(pos3[0]);
            pos3[1] = this.adjustXY(pos3[1]);
            buffer.push(...pos1, this.adjustHeight(map.r_elevation[r]), ...[
                color >> 16
                , color >> 8
                , color
            ].map(x => (x & 0xff) / 255));
            buffer.push(...pos2, this.adjustHeight(map.t_elevation[t1]), ...[
                color >> 16
                , color >> 8
                , color
            ].map(x => (x & 0xff) / 255));
            buffer.push(...pos3, this.adjustHeight(map.t_elevation[t2]), ...[
                color >> 16
                , color >> 8
                , color
            ].map(x => (x & 0xff) / 255));

        }
        const bufferSprite = [
            -1, -1,
            1, -1,
            1, 1,
            1, 1,
            -1, 1,
            -1, -1,
        ]
        this.framebuffer?.initVAO(buffer.length / 6);
        this.framebuffer?.updateBuffer(0, buffer);
        this.renderer?.initVAO(bufferSprite.length / 2);
        this.renderer?.updateBuffer(0, bufferSprite);
    }
    draw(): void {
        this.framebuffer?.bind();
        this.framebuffer?.render();
        this.framebuffer?.unbind();
        this.renderer?.render();
    }
}