import Device from "../device/Device";
import Renderer from "./Renderer";

export default class ImageRenderer extends Renderer {
    initVAO(count: number): void {
        this.count = count;
        const context = this.context;
        const vao = this.handler.vao;
        const buffer = this.handler.buffer;
        context.bindVertexArray(vao);
        const attributeLocation = context.getAttribLocation(this.handler.program, "a_position");
        context.enableVertexAttribArray(attributeLocation);
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.bufferData(context.ARRAY_BUFFER, 2 * 4 * count, context.STATIC_DRAW);
        context.vertexAttribPointer(attributeLocation, 2, context.FLOAT, false, 0, 0);
        context.bindVertexArray(null);
        context.bindBuffer(context.ARRAY_BUFFER, null)
    }
    async loadTextureSource(device: Device, tex: string): Promise<void> {
        const context = this.context;
        this.handler.texture = context.createTexture();
        context.bindTexture(context.TEXTURE_2D, this.handler.texture);
        const img = await device.readImage(`resources/image/gfx/${tex}.png`);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, img.width, img.height, 0, context.RGBA, context.UNSIGNED_BYTE, img);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
        context.bindTexture(context.TEXTURE_2D, null);
    }
    constructor(context: WebGL2RenderingContext) {
        super(context, "image");
    }
}