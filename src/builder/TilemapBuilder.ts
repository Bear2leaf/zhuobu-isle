import { EmbeddedTileset, Map, UnencodedTileLayer } from "@kayahr/tiled";
import Device from "../device/Device.js";
import Builder from "./Builder.js";
import Tilemap from "../tiled/Tilemap.js";

export default class TilemapBuilder implements Builder<Tilemap> {
    private tiledMap?: Tilemap;
    private map?: Map;
    async load(device: Device) {
        this.map = await device.readJson(`resources/tiled/isle.json`) as Map;
        return this;
    }
    parse() {
        if (!this.map) {
            throw new Error("map is undefined");
        }
        this.tiledMap = new Tilemap(
            this.map.tilesets as EmbeddedTileset[]
            , this.map.layers as UnencodedTileLayer[]
            , this.map.width
            , this.map.height
            , this.map.tilewidth
            , this.map.tileheight
        );
        return this;
    }
    build(): Tilemap {
        const tiledMap = this.tiledMap;
        if (!tiledMap) {
            throw new Error("tiledMap is undefined");
        }
        this.tiledMap = undefined;
        return tiledMap;
    }

}