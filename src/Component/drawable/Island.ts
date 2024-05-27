import Device from "../../device/Device.js";
import IslandFramebuffer from "../../framebuffer/IslandFramebuffer.js";
import Drawable from "./Drawable.js";
export default class Island extends Drawable {
    private framebuffer?: IslandFramebuffer;
    initRenderer(context: WebGL2RenderingContext): void {
        super.initRenderer(context);
        this.framebuffer = new IslandFramebuffer(context);
    }
    async load(device: Device): Promise<void> {
        await this.renderer?.loadShaderSource(device);
        await this.feedback?.loadShaderSource(device);
        await this.framebuffer?.loadShaderSource(device);
        await this.renderer?.loadTextureSource(device, "")
        const texture = this.renderer?.handler.texture;
        if (!texture) {
            throw new Error("texture is undefined")
        }
        await this.framebuffer?.loadTextureSource(device, texture);
    }
    init(): void {
        const buffer = [
            -1, -1, 0, 1, 0.5, 1,
            1, -1, 0, 1, 0.5, 1,
            1, 1, 0, 1, 0.5, 1,
            1, 1, 0, 1, 0.5, 1,
            -1, 1, 0, 1, 0.5, 1,
            -1, -1, 0, 1, 0.5, 1,
        ]
        const bufferSprite = [
            0, -1, -1, 0, 0, 0, 0, 1024, 1024,
            0, 1, -1, 1, 0, 0, 0, 1024, 1024,
            0, 1, 1, 1, 1, 0, 0, 1024, 1024,
            0, 1, 1, 1, 1, 0, 0, 1024, 1024,
            0, -1, 1, 0, 1, 0, 0, 1024, 1024,
            0, -1, -1, 0, 0, 0, 0, 1024, 1024,
        ]
        this.framebuffer?.initVAO(buffer.length / 6);
        this.framebuffer?.updateBuffer(0, buffer);
        this.renderer?.initVAO(bufferSprite.length / 9);
        this.renderer?.updateBuffer(0, bufferSprite);
    }
    draw(): void {
        this.framebuffer?.bind();
        this.framebuffer?.render();
        this.framebuffer?.unbind();
        this.renderer?.render();
    }
}