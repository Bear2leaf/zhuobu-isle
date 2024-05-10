import { vec4 } from "gl-matrix";
import CommandBuilder from "../builder/CommandBuilder.js";
import Camera from "../camera/Camera.js";
import Character from "../component/drawable/Character.js";
import Device from "../device/Device";
import Scene from "../scene/Scene.js";
type InputType = "TouchStart" | "TouchMove" | "TouchEnd" | "TouchCancel";
export default class Input {
    private last?: InputType;
    private readonly queue: {
        type: InputType,
        x: number,
        y: number
    }[];
    onclick?: (x: number, y: number) => void
    ondrag?: (deltaX: number, deltaY: number) => void
    onrelease?: () => void;
    constructor(device: Device) {
        this.queue = [];
        device.onTouchStart((e: typeof this.queue[0]) => {
            this.queue.push(Object.assign(e, { type: "TouchStart" }));
        })
        device.onTouchMove((e: typeof this.queue[0]) => {
            this.queue.push(Object.assign(e, { type: "TouchMove" }));
        })
        device.onTouchEnd((e: typeof this.queue[0]) => {
            this.queue.push({ x: 0, y: 0, type: "TouchEnd" });
        })
        device.onTouchCancel((e: typeof this.queue[0]) => {
            this.queue.push({ x: 0, y: 0, type: "TouchEnd" });
        })
    }
    update() {
        const e = this.queue[this.queue.length - 1];
        if (e === undefined) {
            return;
        }
        if (e.type === "TouchStart") {
        }
        if (e.type === "TouchEnd" && (this.last === "TouchStart" || (this.last === "TouchMove" && this.queue.length < 4))) {
            const lastE = this.queue[this.queue.length - 2];
            if (lastE === undefined) {
                return;
            }
            this.onclick && this.onclick(lastE.x, lastE.y);
        }
        if (e.type === "TouchEnd") {
            this.onrelease && this.onrelease();
            this.queue.splice(0, this.queue.length);
        }
        if (e.type === "TouchMove") {
            const lastE = this.queue[this.queue.length - 2];
            if (lastE === undefined) {
                return;
            }
            const delta: [number, number] = [e.x - lastE.x, lastE.y - e.y]
            this.ondrag && this.ondrag(...delta)
        }
        this.last = e.type;
    }
    setupCommands(camera: Camera, scene: Scene, sendmessage?: (data: MainMessage) => void) {
        const builder = new CommandBuilder();
        this.onclick = (x: number, y: number) => {
            builder.prepareInput(x, y, "onclick", camera).build().execute();
            for (const character of scene.getComponents(Character)) {
                builder.prepareInput(x, y, "onclick", camera, character, sendmessage).build().execute()
            }
        }
        this.onrelease = () => {
            builder.prepareInput(0, 0, "onrelease", camera).build().execute();
        }
        this.ondrag = (x: number, y: number) => {
            builder.prepareInput(x, y, "ondrag", camera).build().execute();
        }
    }
}