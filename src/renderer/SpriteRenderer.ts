import Device from "../device/Device.ts";
import Renderer from "./Renderer.ts";

export default class SpriteRenderer extends Renderer {
    getTarget() {
        return { vao: this.handler.vao, buffer: this.handler.buffer };
    }
    initVAO(): void {
        const context = this.context;
        const vao = this.handler.vao;
        const buffer = this.handler.buffer;
        context.bindBuffer(context.ARRAY_BUFFER, this.handler.buffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array([
            0, -1, -1, 0, 0,
            0, 1, -1, 1 / (640 / 16), 0,
            0, 1, 1, 1 / (640 / 16), 1 / (640 / 16),
            0, 1, 1, 1 / (640 / 16), 1 / (640 / 16),
            0, -1, 1, 0, 1 / (640 / 16),
            0, -1, -1, 0, 0
        ]), context.STATIC_DRAW);
        context.bindBuffer(context.ARRAY_BUFFER, null)

        const attributeLocation0 = context.getAttribLocation(this.handler.program, "a_time");
        const attributeLocation1 = context.getAttribLocation(this.handler.program, "a_position");
        const attributeLocation2 = context.getAttribLocation(this.handler.program, "a_texcoord");
        context.bindVertexArray(this.handler.vao);
        context.bindBuffer(context.ARRAY_BUFFER, this.handler.buffer);
        context.vertexAttribPointer(attributeLocation0, 1, context.FLOAT, false, 5 * 4, 0);
        context.vertexAttribPointer(attributeLocation1, 2, context.FLOAT, false, 5 * 4, 4 * 1);
        context.vertexAttribPointer(attributeLocation2, 2, context.FLOAT, false, 5 * 4, 4 * 3);
        context.enableVertexAttribArray(attributeLocation0);
        context.enableVertexAttribArray(attributeLocation1);
        context.enableVertexAttribArray(attributeLocation2);
        context.bindBuffer(context.ARRAY_BUFFER, null);
        context.bindVertexArray(null);
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
    async loadShaderSource(device: Device): Promise<void> {
        await super.loadShaderSource(device);
        this.linkProgram();
    }
    constructor(context: WebGL2RenderingContext) {
        super(context, "sprite");
    }
}