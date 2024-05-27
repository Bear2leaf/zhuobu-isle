import { vec2, vec4 } from "gl-matrix";
export type FontInfo = { [key: string]: { width: number, height: number, x: number, y: number, offsetX: number, offsetY: number } };

export default class Text {
    private color: [number, number, number, number] = [1, 0.3, 0.3, 1];
    private spacing: number = 8;
    private readonly chars: string[] = [];
    readonly vertices: number[] = [];
    private readonly textBoundingSize: vec2 = vec2.fromValues(0, 0);
    updateChars(chars: string) {
        this.chars.splice(0, this.chars.length, ...chars.split(""));
    }
    create(fontInfo: FontInfo, lineHeight: number) {
        let [x, y] = [0, 0];
        const { spacing, chars } = this;
        const ox = x;
        this.vertices.splice(0, this.vertices.length);
        vec2.zero(this.textBoundingSize);
        const batch = this.vertices;
        for (const c of chars) {
            const ch = fontInfo[c];
            const xpos = x - ch.offsetX;
            const ypos = y;
            const w = ch.width;
            const h = -ch.height;
            x += w + spacing;
            if (c === '\n') {
                x = ox;
                y += -lineHeight - spacing;
                continue;
            } else if (c === ' ') {
                continue;
            }
            const vertices = [
                xpos, ypos + h      , ...this.color, ch.x           , ch.y,
                xpos + w, ypos      , ...this.color, ch.x + ch.width, ch.y + ch.height,
                xpos, ypos          , ...this.color, ch.x           , ch.y + ch.height,
                xpos, ypos + h      , ...this.color, ch.x           , ch.y,
                xpos + w, ypos + h  , ...this.color, ch.x + ch.width, ch.y,
                xpos + w, ypos      , ...this.color, ch.x + ch.width, ch.y + ch.height
            ]
            batch.push(...vertices);
            this.textBoundingSize[0] = Math.min(this.textBoundingSize[0], xpos)
            this.textBoundingSize[1] = Math.max(this.textBoundingSize[1], ypos)
            this.textBoundingSize[2] = Math.max(this.textBoundingSize[2], xpos + w);
            this.textBoundingSize[3] = Math.min(this.textBoundingSize[3], h * 2 + ypos);
        }
    }
}