import { mat4 } from "gl-matrix";
import Device from "../device/Device";
import Renderer from "./Renderer";

export default class SpriteRenderer extends Renderer {
    initVAO(count: number): void {
        this.count = count;
        const context = this.context;
        const vao = this.handler.vao;
        const buffer = this.handler.buffer;
        context.bindBuffer(context.ARRAY_BUFFER, this.handler.buffer);
        context.bufferData(context.ARRAY_BUFFER, 9 * 4 * count, context.STATIC_DRAW);
        context.bindBuffer(context.ARRAY_BUFFER, null)

        const attributeLocation0 = context.getAttribLocation(this.handler.program, "a_time");
        const attributeLocation1 = context.getAttribLocation(this.handler.program, "a_position");
        const attributeLocation2 = context.getAttribLocation(this.handler.program, "a_texcoord");
        const attributeLocation3 = context.getAttribLocation(this.handler.program, "a_frame");
        context.bindVertexArray(this.handler.vao);
        context.bindBuffer(context.ARRAY_BUFFER, this.handler.buffer);
        context.vertexAttribPointer(attributeLocation0, 1, context.FLOAT, false, 9 * 4, 0);
        context.vertexAttribPointer(attributeLocation1, 2, context.FLOAT, false, 9 * 4, 4 * 1);
        context.vertexAttribPointer(attributeLocation2, 2, context.FLOAT, false, 9 * 4, 4 * 3);
        context.vertexAttribPointer(attributeLocation3, 4, context.FLOAT, false, 9 * 4, 4 * 5);
        context.enableVertexAttribArray(attributeLocation0);
        context.enableVertexAttribArray(attributeLocation1);
        context.enableVertexAttribArray(attributeLocation2);
        context.enableVertexAttribArray(attributeLocation3);
        context.bindBuffer(context.ARRAY_BUFFER, null);
        context.bindVertexArray(null);
    }
    async loadTextureSource(device: Device, tex: string): Promise<void> {
        const context = this.context;
        this.handler.texture = context.createTexture();
        context.bindTexture(context.TEXTURE_2D, this.handler.texture);
        if (tex === "") {
            context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, 1024, 1024, 0, context.RGBA, context.UNSIGNED_BYTE, null);
        } else {
            const img = await device.readImage(`resources/image/gfx/${tex}.png`);
            context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, img.width, img.height, 0, context.RGBA, context.UNSIGNED_BYTE, img);
        }
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
        context.bindTexture(context.TEXTURE_2D, null);
    }
    async loadShaderSource(device: Device): Promise<void> {
        await super.loadShaderSource(device);
        this.linkProgram();
    }
    constructor(context: WebGL2RenderingContext) {
        super(context, "sprite");
    }
}