import Command from "./Command.js";
import { MainMessage } from "../device/Device.js";
import Tilemap from "../tiled/Tilemap.js";
import { BiomeColor } from "../island/biomes.js";
import { chunk } from "lodash";

export default class InitIslandDataCmd implements Command {
    constructor(
        private readonly data: number[],
        private readonly tiled: Tilemap,
        private readonly sendmessage: (data: MainMessage) => void
    ) {

    }
    execute(): void {
        const map = this.tiled;
        const gridsX = map.getWidth();
        const gridsY = map.getHeight();
        const connersX = gridsX + 1;
        const connersY = gridsY + 1;
        const tileWidth = map.getTilewidth();
        const tileHeight = map.getTileheight();
        const fields: number[][] = new Array(connersY).fill([])
        fields.forEach((col, i, arr) => arr[i] = new Array(connersX).fill(0));
        const chunks = chunk(this.data, gridsX * tileWidth * 4);
        for (let i = 0; i < connersY; i++) {
            for (let j = 0; j < connersX; j++) {
                if (i === connersY - 1 || j === connersX - 1) {
                    fields[connersY - i - 1][j] = BiomeColor.OCEAN;
                } else {
                    const colors0 = chunks[i * tileHeight][j * tileWidth * 4];
                    const colors1 = chunks[i * tileHeight][j * tileWidth * 4 + 1];
                    const colors2 = chunks[i * tileHeight][j * tileWidth * 4 + 2];
                    const colors3 = chunks[i * tileHeight][j * tileWidth * 4 + 3];
                    const color = (colors0 << 16) | (colors1 << 8) | (colors2)
                    if (color === BiomeColor.OCEAN || color === BiomeColor.BEACH || color === BiomeColor.GRASSLAND) {
                        fields[connersY - i - 1][j] = color;
                    } else {
                        fields[connersY - i - 1][j] = BiomeColor.TEMPERATE_RAIN_FOREST;
                    }
                }
            }
        }
        this.sendmessage && this.sendmessage({
            type: "initIslandData",
            data: { conners: fields, biomeColors: BiomeColor }
        })
    }

}