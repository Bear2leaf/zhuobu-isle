import Device from "../device/Device.ts";
import Renderer from "./Renderer.ts";

export default class SpriteRenderer extends Renderer {
    initVAO(): void {
        const context = this.context;
        const vao = this.handler.vao;
        const buffer = this.handler.buffer;
        context.bindVertexArray(vao);
        const attributeLocation0 = context.getAttribLocation(this.handler.program, "a_position");
        const attributeLocation1 = context.getAttribLocation(this.handler.program, "a_texcoord");
        context.enableVertexAttribArray(attributeLocation0);
        context.enableVertexAttribArray(attributeLocation1);
        console.log(attributeLocation0, attributeLocation1)
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array([
            -1, -1, 0, 0,
            1, -1, 1 / (640 / 16), 0,
            1, 1, 1 / (640 / 16), 1 / (640 / 16),
            1, 1,
            1 / (640 / 16), 1 / (640 / 16),
            -1, 1,
            0, 1 / (640 / 16),
            -1, -1,
            0, 0
        ]), context.STATIC_DRAW);
        context.vertexAttribPointer(attributeLocation0, 2, context.FLOAT, false, 4 * 4, 0);
        context.vertexAttribPointer(attributeLocation1, 2, context.FLOAT, false, 4 * 4, 4 * 2);
        context.bindVertexArray(null);
        context.bindBuffer(context.ARRAY_BUFFER, null)
        this.count = 6
    }
    async loadTextureSource(device: Device): Promise<void> {
        const context = this.context;
        context.bindTexture(context.TEXTURE_2D, this.handler.texture);
        const img = await device.readImage("resources/image/gfx/Overworld.png");
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, img.width, img.height, 0, context.RGBA, context.UNSIGNED_BYTE, img);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
        context.bindTexture(context.TEXTURE_2D, null);
    }
    prepare(viewport: [number, number, number, number], color: [r: number, g: number, b: number, a: number]): void {
        super.prepare(viewport, color);
        const context = this.context;
        context.useProgram(this.handler.program);
        context.activeTexture(context.TEXTURE0);
        context.bindTexture(context.TEXTURE_2D, this.handler.texture);
        context.uniform1i(context.getUniformLocation(this.handler.program, "u_texture"), 0);
    }
    constructor(context: WebGL2RenderingContext) {
        super(context, "sprite");
    }
}