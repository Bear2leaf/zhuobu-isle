import type { BiomeColor } from "../island/biomes.js"

export type MainMessage = {
  type: "hello"
  data: void
} | {
  type: "initTileMap",
  data: any
} | {
  type: "plan",
  data: void
} | {
  type: "findPath",
  data: {
    start: [number, number],
    end: [number, number]
  }
} | {
  type: "initIslandData",
  data: { conners: number[][], biomeColors: typeof BiomeColor }
}
export type WorkerMessage = {
  type: "worker"
  data: number[]
} | {
  type: "path",
  data: [number, number][]
} | {
  type: "generateObject",
  data: {
    position: [number, number],
    element:number
  }
} | {
  type: "removeObject",
  data: {
    position: [number, number],
    element:number
  }
} | {
  type: "updateLayer",
  data: number[][]
}
export default interface Device {
  getContext2d(): CanvasRenderingContext2D;
  getContext(): WebGL2RenderingContext;
  reload(): void;
  getWindowInfo(): readonly [number, number];
  now(): number;
  loadSubpackage(): Promise<null>;
  sendmessage?: (data: MainMessage) => void;
  onmessage?: (data: WorkerMessage) => void;
  createWorker(url: string): void;
  terminateWorker(): void;
  createWebAudioContext(): AudioContext;
  onTouchStart(listener: Function): void;
  onTouchMove(listener: Function): void;
  onTouchEnd(listener: Function): void;
  onTouchCancel(listener: Function): void;
  readImage(file: string): Promise<HTMLImageElement>;
  readJson(file: string): Promise<Object>;
  readText(file: string): Promise<string>;
  readBuffer(file: string): Promise<ArrayBuffer>;
}

