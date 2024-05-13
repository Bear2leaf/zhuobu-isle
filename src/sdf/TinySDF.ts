import { INF, edt } from "./utils.js";

export default class TinySDF {
    private readonly buffer: number;
    private readonly cutoff: number;
    private readonly radius: number;
    private readonly size: number;
    private readonly context: CanvasRenderingContext2D;
    private readonly gridOuter: Float64Array;
    private readonly gridInner: Float64Array;
    private readonly f: Float64Array;
    private readonly z: Float64Array;
    private readonly v: Uint16Array;
    constructor({
        fontSize = 24, buffer = 3, radius = 8, cutoff = 0.2, fontFamily = 'sans-serif', fontWeight = 'normal', fontStyle = 'normal',
    } = {}, context: CanvasRenderingContext2D) {
        this.buffer = buffer;
        this.cutoff = cutoff;
        this.radius = radius;
        this.context = context;

        // make the canvas size big enough to both have the specified buffer around the glyph
        // for "halo", and account for some glyphs possibly being larger than their font size
        const size = this.size = fontSize + buffer * 4;
        const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        const textBaseline = 'alphabetic';
        const textAlign = 'left'; // Necessary so that RTL text doesn't have different alignment
        const fillStyle = 'black';
        this.context.font = font;
        this.context.textAlign = textAlign;
        this.context.textBaseline = textBaseline;
        this.context.fillStyle = fillStyle;
        // temporary arrays for the distance transform
        this.gridOuter = new Float64Array(size * size);
        this.gridInner = new Float64Array(size * size);
        this.f = new Float64Array(size);
        this.z = new Float64Array(size + 1);
        this.v = new Uint16Array(size);
    }

    draw(char: string) {
        const {
            width: glyphAdvance, actualBoundingBoxAscent, actualBoundingBoxDescent
        } = this.context.measureText(char);

        // The integer/pixel part of the top alignment is encoded in metrics.glyphTop
        // The remainder is implicitly encoded in the rasterization
        const glyphTop = Math.ceil(actualBoundingBoxAscent);
        const glyphLeft = 0;

        // If the glyph overflows the canvas size, it will be clipped at the bottom/right
        const glyphWidth = Math.max(0, Math.min(this.size - this.buffer, Math.ceil(glyphAdvance)));
        const glyphHeight = Math.min(this.size - this.buffer, glyphTop + Math.ceil(actualBoundingBoxDescent));

        const width = glyphWidth + 2 * this.buffer;
        const height = glyphHeight + 2 * this.buffer;

        const len = Math.max(width * height, 0);
        const data = new Uint8ClampedArray(len);
        const glyph = { data, width, height, glyphWidth, glyphHeight, glyphTop, glyphLeft, glyphAdvance };
        if (glyphWidth === 0 || glyphHeight === 0) return glyph;

        const { context, buffer, gridInner, gridOuter } = this;
        context.clearRect(buffer, buffer, glyphWidth, glyphHeight);
        context.fillText(char, buffer, buffer + glyphTop);
        const imgData = context.getImageData(buffer, buffer, glyphWidth, glyphHeight) as ImageData;

        // Initialize grids outside the glyph range to alpha 0
        gridOuter.fill(INF, 0, len);
        gridInner.fill(0, 0, len);

        for (let y = 0; y < glyphHeight; y++) {
            for (let x = 0; x < glyphWidth; x++) {
                const a = imgData.data[4 * (y * glyphWidth + x) + 3] / 255; // alpha value
                if (a === 0) continue; // empty pixels

                const j = (y + buffer) * width + x + buffer;

                if (a === 1) { // fully drawn pixels
                    gridOuter[j] = 0;
                    gridInner[j] = INF;

                } else { // aliased pixels
                    const d = 0.5 - a;
                    gridOuter[j] = d > 0 ? d * d : 0;
                    gridInner[j] = d < 0 ? d * d : 0;
                }
            }
        }

        edt(gridOuter, 0, 0, width, height, width, this.f, this.v, this.z);
        edt(gridInner, buffer, buffer, glyphWidth, glyphHeight, width, this.f, this.v, this.z);

        for (let i = 0; i < len; i++) {
            const d = Math.sqrt(gridOuter[i]) - Math.sqrt(gridInner[i]);
            data[i] = Math.round(255 - 255 * (d / this.radius + this.cutoff));
        }

        return glyph;
    }
}
