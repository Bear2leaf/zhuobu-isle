import Text, { FontInfo } from "./Text.js";
import TinySDF from "./TinySDF.js";

export default class FontCanvas {
    private readonly tinySDF: TinySDF
    private readonly fontSize: number;
    private readonly buffer: number;
    readonly radius: number;
    readonly fontWeight: string;
    readonly fontInfo: FontInfo;
    constructor(
        private readonly context: CanvasRenderingContext2D,
    ) {
        const fontSize = this.fontSize = 24;
        const fontWeight = this.fontWeight = "400";
        const buffer = this.buffer = Math.ceil(fontSize / 16);
        const radius = this.radius = Math.ceil(fontSize / 9);
        this.tinySDF = new TinySDF({ fontSize, buffer, radius, fontWeight }, this.context);
        this.fontInfo = {}
    }
    // Convert alpha-only to RGBA so we can use `putImageData` for building the composite bitmap
    makeRGBAImageData(alphaChannel: Uint8ClampedArray, width: number, height: number) {
        const imageData = this.context.createImageData(width, height);
        for (let i = 0; i < alphaChannel.length; i++) {
            imageData.data[4 * i + 0] = alphaChannel[i];
            imageData.data[4 * i + 1] = alphaChannel[i];
            imageData.data[4 * i + 2] = alphaChannel[i];
            imageData.data[4 * i + 3] = 255;
        }
        return imageData;
    }
    initSDFTexture(): void {

        const fontSize = this.fontSize;
        const buffer = this.buffer;
        const chars = '\n 和气生财你好世界abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{};\'\\:"|,./<>?~`·！￥…（）—【】、；‘：“《》，。？～';
        const gridWidth = Math.ceil(Math.sqrt(chars.length));
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const glyph = this.tinySDF.draw(char);
            this.fontInfo[char] = {
                x: i % gridWidth * (fontSize + buffer * 4),
                y: Math.floor(i / gridWidth) * (fontSize + buffer * 4),
                width: glyph.width,
                height: glyph.height,
                offsetX: glyph.glyphLeft,
                offsetY: glyph.glyphTop
            };
            this.context.putImageData(this.makeRGBAImageData(glyph.data, glyph.width, glyph.height), this.fontInfo[char].x, this.fontInfo[char].y);
        }

    }
    getCanvas() {
        return this.context.canvas;
    }

}