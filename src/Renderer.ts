

import Device from "./device/Device";


export default class Renderer {
    private readonly context: WebGL2RenderingContext;
    private readonly vao: WebGLVertexArrayObject;
    private readonly buffer: WebGLBuffer;
    private readonly program: WebGLProgram;
    constructor(context: WebGL2RenderingContext) {
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
        this.program = program;
        this.vao = vao;
        this.buffer = buffer;
        this.context = context;
    }
    async loadShaderSource(device: Device) {
        const vertexShaderSource = await device.readText(`resources/glsl/demo.vert.sk`)
        const fragmentShaderSource = await device.readText(`resources/glsl/demo.frag.sk`)
        const context = this.context;
        if (vertexShaderSource === undefined || fragmentShaderSource === undefined) {
            throw new Error("Shader source is undefined");
        }
        const program = this.program;
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
	initVAO() {
        const context = this.context;
        const vao = this.vao;
        const buffer = this.buffer;
        context.bindVertexArray(vao);
        const attributeLocation = context.getAttribLocation(this.program, "a_position");
        context.enableVertexAttribArray(attributeLocation);
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array([0, 0, 0.5, 0, 0.5, 0.5]), context.STATIC_DRAW);
        context.vertexAttribPointer(attributeLocation, 2, context.FLOAT, false, 0, 0);
        context.bindVertexArray(null);
        context.bindBuffer(context.ARRAY_BUFFER, null)
	}
    prepare(viewport: [number, number, number, number], color: [r: number, g: number, b: number, a: number]) {
        const context = this.context;
        context.viewport(...viewport);
        context.scissor(...viewport);
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
        context.clearColor(...color);
    }
	render() {
        const context = this.context
        context.useProgram(this.program);
		context.bindVertexArray(this.vao);
		context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
        context.drawArrays(context.TRIANGLES, 0, 3);
	}
}