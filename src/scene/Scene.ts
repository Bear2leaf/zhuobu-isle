import Device from "../device/Device";
import Camera from "../camera/Camera";

export default interface Scene {
    load(device: Device): Promise<void>
    onmessage(data: WorkerMessage): void
    init(): void
    onclick(x: number, y: number): void
    updateCamera(camera: Camera): void
    update(now: number, delta: number): void
    render(): void
}