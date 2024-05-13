import { EmbeddedTileset, Map, UnencodedTileLayer } from "@kayahr/tiled";
import Device from "../device/Device.js";
import Builder from "./Builder.js";
import TiledMap from "../tiled/TiledMap.js";

export default class TiledMapBuilder implements Builder<TiledMap> {
    private tiledMap?: TiledMap;
    private map?: Map;
    async load(device: Device) {
        this.map = await device.readJson(`resources/tiled/isle.json`) as Map;
        return this;
    }
    parse() {
        if (!this.map) {
            throw new Error("map is undefined");
        }
        this.tiledMap = new TiledMap(
            this.map.tilesets as EmbeddedTileset[]
            , this.map.layers as UnencodedTileLayer[]
            , this.map.width
            , this.map.height
            , this.map.tilewidth
            , this.map.tileheight
        );
        return this;
    }
    build(): TiledMap {
        const tiledMap = this.tiledMap;
        if (!tiledMap) {
            throw new Error("tiledMap is undefined");
        }
        this.tiledMap = undefined;
        return tiledMap;
    }

}