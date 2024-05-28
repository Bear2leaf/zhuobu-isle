import Command from "./Command.js";
import Layer from "../component/drawable/Layer.js";

export default class GenerateObjectCmd implements Command {
    constructor(
        private readonly layer: Layer,
        private readonly data: number[],
        private readonly element: number
    ) { }
    execute(): void {
        if (this.layer.getData().name === "object") {
            this.layer.generateObject(this.data, this.element);
        }
    }

}