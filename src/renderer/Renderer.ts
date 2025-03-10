
import { mat4 } from "gl-matrix";
import Device from "../device/Device";


export default abstract class Renderer {
    protected readonly context: WebGL2RenderingContext;
    readonly handler: {
        readonly vao: WebGLVertexArrayObject,
        readonly buffer: WebGLBuffer,
        readonly program: WebGLProgram,
        texture: WebGLTexture | null,
    }
    private readonly locMap: Map<string, WebGLUniformLocation | null>;
    protected count: number = 0;
    constructor(context: WebGL2RenderingContext, private readonly name: string) {
        this.context = context;
        this.locMap = new Map();
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
        this.handler = {
            program,
            vao,
            buffer,
            texture: null
        }
        context.enable(context.BLEND);
        context.enable(context.SCISSOR_TEST);
        context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
        context.blendFuncSeparate(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA, context.ONE, context.ONE);
        context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
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
        context.deleteShader(fragmentShader)

    }
    protected linkProgram() {
        const context = this.context;
        const program = this.handler.program;
        context.linkProgram(program);
        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            console.error(context.getProgramInfoLog(program));
            throw new Error("Failed to link program");
        }
    }
    abstract loadTextureSource(device: Device, texture: string | WebGLTexture): Promise<void>;
    abstract initVAO(count?: number): void;
    updateBuffer(start: number, buffer: number[]) {
        const context = this.context;
        context.bindBuffer(context.ARRAY_BUFFER, this.handler.buffer);
        context.bufferSubData(context.ARRAY_BUFFER, start * 4, new Float32Array(buffer));
        context.bindBuffer(context.ARRAY_BUFFER, null)
    }
    switchDepthTest(enable: boolean): void {
        if (enable) {
            this.context.enable(this.context.DEPTH_TEST);
        } else {
            this.context.disable(this.context.DEPTH_TEST);
        }
    }
    switchDepthWrite(enable: boolean): void {
        this.context.depthMask(enable);
    }
    switchBlend(enable: boolean): void {
        if (enable) {
            this.context.enable(this.context.BLEND);
        } else {
            this.context.disable(this.context.BLEND);
        }
    }
    switchNearestFilter(enable: boolean): void {
        if (enable) {
            this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
            this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
        } else {
            this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.LINEAR);
            this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.LINEAR);
        }
    }
    switchRepeat(enable: boolean): void {
        if (enable) {
            this.context.texParameterf(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.REPEAT);
            this.context.texParameterf(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.REPEAT);
        } else {
            this.context.texParameterf(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
            this.context.texParameterf(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
        }
    }
    switchCulling(enable: boolean): void {
        if (enable) {
            this.context.enable(this.context.CULL_FACE);
        } else {
            this.context.disable(this.context.CULL_FACE);
        }
    }
    switchUnpackPremultiplyAlpha(enable: boolean): void {
        this.context.pixelStorei(this.context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, enable);
    }
    useBlendFuncOneAndOneMinusSrcAlpha(): void {
        this.context.blendFunc(this.context.ONE, this.context.ONE_MINUS_SRC_ALPHA);
        this.context.blendFuncSeparate(this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA, this.context.ONE, this.context.ONE);
    }
    cacheUniformLocation(name: string) {
        let loc = this.locMap.get(name);
        if (loc !== undefined) {
            if (loc === null) {
                throw new Error("unexpected loc")
            }
        } else {
            loc = this.context.getUniformLocation(this.handler.program, name);
            this.locMap.set(name, loc);
        }
        return loc;
    }
    updateProjection(projection: mat4) {
        const context = this.context;
        const program = this.handler.program;
        context.useProgram(program);
        context.uniformMatrix4fv(this.cacheUniformLocation("u_projection"), false, projection);
    }
    updateView(view: mat4) {
        const context = this.context;
        const program = this.handler.program;
        context.useProgram(program);
        context.uniformMatrix4fv(this.cacheUniformLocation("u_view"), false, view);
    }
    updateModel(model: mat4) {
        const context = this.context;
        const program = this.handler.program;
        context.useProgram(program);
        context.uniformMatrix4fv(this.cacheUniformLocation("u_model"), false, model);
    }
    updateDelta(delta: number): void {
        const context = this.context;
        const program = this.handler.program;
        context.useProgram(program);
        context.uniform1f(this.cacheUniformLocation("u_delta"), delta);
    }
    render() {
        const context = this.context;
        context.useProgram(this.handler.program);
        context.activeTexture(context.TEXTURE0);
        if (this.handler.texture) {
            context.bindTexture(context.TEXTURE_2D, this.handler.texture);
            context.uniform1i(context.getUniformLocation(this.handler.program, "u_texture"), 0);
        }
        context.bindVertexArray(this.handler.vao);
        context.bindBuffer(context.ARRAY_BUFFER, this.handler.buffer);
        context.drawArrays(context.TRIANGLES, 0, this.count);
        context.bindBuffer(context.ARRAY_BUFFER, null);
    }
}