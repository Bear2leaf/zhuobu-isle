import Device from "../device/Device";
import { BiomeColor } from "../island/biomes.js";
import Renderer from "../renderer/Renderer";

export default class IslandFramebuffer extends Renderer {
    private framebuffer: WebGLFramebuffer | null = null;
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
    async loadTextureSource(device: Device, texture: WebGLTexture): Promise<void> {
        this.handler.texture = texture;
        const context = this.context;
        this.framebuffer = context.createFramebuffer();
        context.bindFramebuffer(context.FRAMEBUFFER, this.framebuffer);
        context.activeTexture(context.TEXTURE0);
        context.bindTexture(context.TEXTURE_2D, this.handler.texture);
        context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, this.handler.texture, 0);
        context.bindTexture(context.TEXTURE_2D, null);
        context.drawBuffers([context.COLOR_ATTACHMENT0]);
        context.bindFramebuffer(context.FRAMEBUFFER, null);
    }
    render(): void {
        const context = this.context;
        context.bindFramebuffer(context.FRAMEBUFFER, this.framebuffer);
		context.viewport(0, 0, 1024, 1024);
		context.scissor(0, 0, 1024, 1024);
		const ocean = BiomeColor.OCEAN;
		context.clearColor(((ocean >> 16) & 0xff) / 255, ((ocean >> 8) & 0xff) / 255, ((ocean & 0xff) / 255), 1);
		context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.STENCIL_BUFFER_BIT)
        super.render();
        context.bindFramebuffer(context.FRAMEBUFFER, null);
    }
    async loadShaderSource(device: Device): Promise<void> {
        await super.loadShaderSource(device);
        this.linkProgram();
    }
    constructor(context: WebGL2RenderingContext) {
        super(context, "islandFBO");
    }
}