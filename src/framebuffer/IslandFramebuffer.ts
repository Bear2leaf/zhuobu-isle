import Device from "../device/Device";
import Renderer from "../renderer/Renderer";

export default class IslandFramebuffer extends Renderer {
    initVAO(count: number): void {
        this.count = count;
        const context = this.context;
        const vao = this.handler.vao;
        const buffer = this.handler.buffer;
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.bufferData(context.ARRAY_BUFFER, 6 * 4 * count, context.STATIC_DRAW);
        context.bindVertexArray(vao);
        const attributeLocation0 = context.getAttribLocation(this.handler.program, "a_position");
        context.enableVertexAttribArray(attributeLocation0);
        context.vertexAttribPointer(attributeLocation0, 3, context.FLOAT, false, 6 * 4, 0);
        const attributeLocation1 = context.getAttribLocation(this.handler.program, "a_color");
        context.enableVertexAttribArray(attributeLocation1);
        context.vertexAttribPointer(attributeLocation1, 3, context.FLOAT, false, 6 * 4, 4 * 3);
        context.bindVertexArray(null);
        context.bindBuffer(context.ARRAY_BUFFER, null)
    }
    async loadTextureSource(device: Device, tex: string): Promise<void> {
        const context = this.context;
        context.bindTexture(context.TEXTURE_2D, this.handler.texture);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, 1024, 1024, 0, context.RGBA, context.UNSIGNED_BYTE, null);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
        context.bindTexture(context.TEXTURE_2D, null);
    }
    constructor(context: WebGL2RenderingContext) {
        super(context, "islandFBO");
    }
}