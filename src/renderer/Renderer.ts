

import Device from "../device/Device";


export default abstract class Renderer {
    protected readonly context: WebGL2RenderingContext;
    protected readonly handler: {
        readonly vao: WebGLVertexArrayObject,
        readonly buffer: WebGLBuffer,
        readonly program: WebGLProgram,
        readonly texture: WebGLTexture,
    }
    protected count: number = 0;
    constructor(context: WebGL2RenderingContext, private readonly name: string) {
        this.context = context;
        const program = context.createProgram();
        if (program === null) {
            throw new Error("program not create");
        }
        const vao = context.createVertexArray();
        if (vao === null) {
            throw new Error("vao not create");
        }
        const buffer = context.createBuffer();
        if (buffer === null) {
            throw new Error("buffer not create");
        }
        const texture = context.createTexture();
        if (texture === null) {
            throw new Error("texture not create");
        }
        this.handler = {
            program,
            vao,
            buffer,
            texture
        }
    }
    async loadShaderSource(device: Device) {
        const name: string = this.name;
        const vertexShaderSource = await device.readText(`resources/glsl/${name}.vert.sk`)
        const fragmentShaderSource = await device.readText(`resources/glsl/${name}.frag.sk`)
        const context = this.context;
        if (vertexShaderSource === undefined || fragmentShaderSource === undefined) {
            throw new Error("Shader source is undefined");
        }
        const program = this.handler.program;
        const vertexShader = context.createShader(context.VERTEX_SHADER);
        if (vertexShader === null) {
            throw new Error("Failed to create vertex shader");
        }
        context.shaderSource(vertexShader, vertexShaderSource);
        context.compileShader(vertexShader);
        if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
            console.error(context.getShaderInfoLog(vertexShader));
            throw new Error("Failed to compile vertex shader");
        }
        context.attachShader(program, vertexShader);
        const fragmentShader = context.createShader(context.FRAGMENT_SHADER);
        if (fragmentShader === null) {
            throw new Error("Failed to create fragment shader");
        }
        context.shaderSource(fragmentShader, fragmentShaderSource);
        context.compileShader(fragmentShader);
        if (!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
            console.error(context.getShaderInfoLog(fragmentShader));
            throw new Error("Failed to compile fragment shader");
        }
        context.attachShader(program, fragmentShader);
        context.linkProgram(program);
        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            console.error(context.getProgramInfoLog(program));
            throw new Error("Failed to link program");
        }
        context.deleteShader(vertexShader)
        context.deleteShader(fragmentShader)

    }
    abstract loadTextureSource(device: Device): Promise<void>;
    abstract initVAO(): void;
    prepare(viewport: [number, number, number, number], color: [r: number, g: number, b: number, a: number]) {
        const context = this.context;
        context.viewport(...viewport);
        context.scissor(...viewport);
        context.clearColor(...color);
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
    }
    render() {
        const context = this.context
        context.useProgram(this.handler.program);
        context.bindVertexArray(this.handler.vao);
        context.bindBuffer(context.ARRAY_BUFFER, this.handler.buffer);
        context.drawArrays(context.TRIANGLES, 0, this.count);
    }
}