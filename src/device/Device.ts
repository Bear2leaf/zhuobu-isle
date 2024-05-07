import { MainMessage, WorkerMessage } from "../message";

export default interface Device {
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

