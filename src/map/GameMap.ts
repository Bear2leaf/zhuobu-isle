import Device from "../device/Device";
import Camera from "../camera/Camera";

export default interface GameMap {
    worldPositionToTilePoint(x: number, y: number): Point
    load(name: string, device: Device): Promise<void>
    onmessage(data: WorkerMessage): void
    setSendMessage(sendmessage: (data: MainMessage) => void): void
    init(): void
    onclick(x: number, y: number): void
    updateCamera(camera: Camera): void
    update(now: number, delta: number): void
    render(): void
}