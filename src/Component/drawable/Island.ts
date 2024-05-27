import Device from "../../device/Device.js";
import Drawable from "./Drawable.js";
export default class Island extends Drawable {
    async load(device: Device): Promise<void> {
        await this.renderer?.loadShaderSource(device);
        await this.feedback?.loadShaderSource(device);
    }
}