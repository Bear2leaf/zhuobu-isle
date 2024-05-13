import Layer from "../component/drawable/Layer.js";

export default interface TileInterpreter {
    interpret(context: Layer, tileIdx: number): void;
}