import TiledMap from "./TiledMap.js";

export default interface TileInterpreter {
    interpret(context: TiledMap, layer: number, tileIdx: number): void;
}