import { vec2, vec4 } from "gl-matrix";
import Camera from "../camera/Camera.js";
import Character from "../component/drawable/Character.js";
import Command from "./Command.js";

export default class InputCmd implements Command {
    constructor(
        private readonly x: number,
        private readonly y: number,
        private readonly type: string,
        private readonly camera?: Camera,
        private readonly character?: Character,
        private readonly sendmessage?: (data: MainMessage) => void
    ) {

    }
    execute(): void {
        if (this.type === "onclick") {
            this.camera?.onclick(this.x, this.y);
            if (this.character) {
                const p = vec4.create()
                this.camera?.screenToWorld(this.x, this.y, p);
                this.sendmessage && this.sendmessage({
                    type: "findPath",
                    data: {
                        start: { x: 0, y: 0 },
                        end: { x: Math.floor(p[0]), y: Math.floor(p[1]) }
                    }
                })
            }
        } else if (this.type === "ondrag") {
            this.camera?.ondrag(this.x, this.y);
        } else if (this.type === "onrelease") {
            this.camera?.onrelease();
        }
    }

}