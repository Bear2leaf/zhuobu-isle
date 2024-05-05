import kaboom, { KaboomCtx } from "kaboom";
import { MainMessage, WorkerMessage } from "../message";

export default abstract class Device {
  readonly engine: KaboomCtx;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = kaboom({
      canvas,
      global: false,
    });
  }
  abstract reload(): void;
  abstract getWindowInfo(): readonly [number, number];
  abstract now(): number;
  abstract loadSubpackage(): Promise<null>;
  abstract sendmessage: (data: MainMessage) => void;
  abstract onmessage: (data: WorkerMessage) => void;
  abstract createWorker(url: string): void;
  abstract terminateWorker(): void;
  abstract createWebAudioContext(): AudioContext;
  abstract onTouchStart(listener: Function): void;
  abstract onTouchMove(listener: Function): void;
  abstract onTouchEnd(listener: Function): void;
  abstract onTouchCancel(listener: Function): void;
  abstract readImage(file: string): Promise<HTMLImageElement>;
  abstract readJson(file: string): Promise<Object>;
  abstract readText(file: string): Promise<string>;
  abstract readBuffer(file: string): Promise<ArrayBuffer>;
}

