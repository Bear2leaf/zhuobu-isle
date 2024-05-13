import { mat4, vec2, vec3 } from "gl-matrix";
import Device from "../device/Device";
import FontCanvas from "../sdf/FontCanvas.js";
import Text from "../sdf/Text.js";
import Renderer from "./Renderer";

export default class TextRenderer extends Renderer {
    private scale: number = 32;
    private buffer: number = 0.5;
    private bufferOutline: number = 0.75;
    private gamma: number = 2;
    private readonly text = new Text();
    private fontCanvas?: FontCanvas;
    initVAO(): void {
        const vertices = this.text.vertices;
        this.count = vertices.length / 8;
        const context = this.context;
        const vao = this.handler.vao;
        const buffer = this.handler.buffer;
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
        context.bindBuffer(context.ARRAY_BUFFER, null)

        const attributeLocation0 = context.getAttribLocation(this.handler.program, "a_position");
        const attributeLocation1 = context.getAttribLocation(this.handler.program, "a_color");
        const attributeLocation2 = context.getAttribLocation(this.handler.program, "a_texcoord");
        context.bindVertexArray(vao);
        context.bindBuffer(context.ARRAY_BUFFER, this.handler.buffer);
        context.vertexAttribPointer(attributeLocation0, 2, context.FLOAT, false, 8 * 4, 0);
        context.vertexAttribPointer(attributeLocation1, 4, context.FLOAT, false, 8 * 4, 4 * 2);
        context.vertexAttribPointer(attributeLocation2, 2, context.FLOAT, false, 8 * 4, 4 * 6);
        context.enableVertexAttribArray(attributeLocation0);
        context.enableVertexAttribArray(attributeLocation1);
        context.enableVertexAttribArray(attributeLocation2);
        context.bindBuffer(context.ARRAY_BUFFER, null);
        context.bindVertexArray(null);
        context.useProgram(this.handler.program);
        context.uniform1f(this.cacheUniformLocation("u_buffer"), this.buffer);
        context.uniform1f(this.cacheUniformLocation("u_bufferOutline"), this.bufferOutline);
        context.uniform1f(this.cacheUniformLocation("u_gamma"), this.gamma * Math.SQRT2 / this.scale);
        context.uniform1f(this.cacheUniformLocation("u_scale"), 0.01);

    }
    async loadShaderSource(device: Device): Promise<void> {
        await super.loadShaderSource(device);
        this.linkProgram();
    }
    async loadTextureSource(device: Device): Promise<void> {
        const context = this.context;
        const fontCanvas = this.fontCanvas;
        if (!fontCanvas) {
            throw new Error("fontCanvas is undefind");
        }
        context.bindTexture(context.TEXTURE_2D, this.handler.texture);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, fontCanvas.getCanvas());
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
        context.bindTexture(context.TEXTURE_2D, null);
    }
    initFontCanvas(context: CanvasRenderingContext2D) {
        this.fontCanvas = new FontCanvas(context);
        this.fontCanvas.initSDFTexture()
        this.text.updateChars("Hello, 你好世界，和气生财！")
        this.text.create(this.fontCanvas.fontInfo)

    }
    updatePosition(position: vec2) {
        const context = this.context;
        context.useProgram(this.handler.program);
        context.uniform2fv(this.cacheUniformLocation("u_offset"), position)

    }
    render(): void {
        const context = this.context;
        context.useProgram(this.handler.program);
        context.uniform1f(this.cacheUniformLocation("u_inner"), 0)
        super.render();
        context.uniform1f(this.cacheUniformLocation("u_inner"), 1)
        super.render();

    }
    constructor(context: WebGL2RenderingContext) {
        super(context, "sdf");
    }
}