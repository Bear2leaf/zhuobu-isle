import Device from "../device/Device";
import Renderer from "../renderer/Renderer";

export default class SpriteFeedback extends Renderer {
    private readonly transformFeedback: WebGLTransformFeedback;
    private get vaos() {
        return [
            this.handler.vao,
            this.backHandler.vao
        ]
    }
    private get buffers() {
        return [
            this.handler.buffer,
            this.backHandler.buffer
        ]
    }
    private get transform() {
        return {
            buffer: this.buffers[this.curIdx],
            vao: this.vaos[this.curIdx]
        };
    }
    private get feedback() {
        return {
            buffer: this.buffers[(this.curIdx + 1) % this.buffers.length],
            vao: this.vaos[(this.curIdx + 1 % this.vaos.length)]
        };
    }
    private curIdx = 0;
    private readonly backHandler: {
        readonly vao: WebGLVertexArrayObject,
        readonly buffer: WebGLBuffer,
    };
    initVAO(count: number): void {
        this.count = count
        const context = this.context;
        context.bindBuffer(context.ARRAY_BUFFER, this.transform.buffer);
        context.bufferData(context.ARRAY_BUFFER, 9 * 4 * count, context.STATIC_DRAW);
        context.bindBuffer(context.ARRAY_BUFFER, null)


        context.bindBuffer(context.ARRAY_BUFFER, this.feedback.buffer);
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


        context.bindVertexArray(this.backHandler.vao);
        context.bindBuffer(context.ARRAY_BUFFER, this.backHandler.buffer);
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
    }
    async loadShaderSource(device: Device): Promise<void> {
        await super.loadShaderSource(device);
        const context = this.context;
        const program = this.handler.program;
        context.transformFeedbackVaryings(program, ["v_time", "v_position", "v_texcoord", "v_frame"], context.INTERLEAVED_ATTRIBS);
        this.linkProgram();
    }
    updateBuffer(start: number, buffer: number[]): void {
        const context = this.context;
        context.bindBuffer(context.ARRAY_BUFFER, this.transform.buffer);
        context.bufferSubData(context.ARRAY_BUFFER, start * 4, new Float32Array(buffer));
        context.bindBuffer(context.ARRAY_BUFFER, null)
    }
    render(): void {
        const context = this.context

        context.enable(context.RASTERIZER_DISCARD);
        context.useProgram(this.handler.program);
        context.bindTransformFeedback(context.TRANSFORM_FEEDBACK, this.transformFeedback);
        context.bindVertexArray(this.transform.vao);
        context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, this.feedback.buffer);
        context.beginTransformFeedback(context.TRIANGLES);
        context.drawArrays(context.TRIANGLES, 0, this.count);
        context.endTransformFeedback();
        context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, this.target.buffer);
        context.beginTransformFeedback(context.TRIANGLES);
        context.drawArrays(context.TRIANGLES, 0, this.count);
        context.endTransformFeedback();
        context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        context.bindTransformFeedback(context.TRANSFORM_FEEDBACK, null);
        context.bindVertexArray(null);
        context.disable(context.RASTERIZER_DISCARD);
        this.curIdx = (this.curIdx + 1) % this.buffers.length;
    }
    constructor(context: WebGL2RenderingContext, private readonly target: { vao: WebGLVertexArrayObject, buffer: WebGLBuffer }) {
        super(context, "sprite.feedback");
        const transformFeedback = context.createTransformFeedback();
        if (transformFeedback === null) {
            throw new Error("transformFeedback not create");
        }
        this.transformFeedback = transformFeedback;
        const vao = context.createVertexArray();
        if (vao === null) {
            throw new Error("vao not create");
        }
        const buffer = context.createBuffer();
        if (buffer === null) {
            throw new Error("buffer not create");
        }
        this.backHandler = {
            vao,
            buffer
        }
    }
}