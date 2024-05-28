import Command from "./Command.js";
import Layer from "../component/drawable/Layer.js";

export default class UpdateLayerCmd implements Command {
    constructor(
        private readonly layer: Layer,
        private readonly data: number[][]
    ) { }
    execute(): void {
        if (this.layer.getData().name === "ground") {
            this.layer.updateLayer(this.data);
        }
    }

}