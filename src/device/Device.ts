
export default interface Device {
  reload(): void;
  getWindowInfo(): [number, number];
  contextGL: WebGL2RenderingContext;
  now(): number;
  loadSubpackage(): Promise<null>;
  emit: (data: any) => void;
  onmessage: (data: any) =>void;
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

