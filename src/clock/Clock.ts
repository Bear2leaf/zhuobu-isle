import Device from "../device/Device.js";

export default class Clock {
    last: number = 0;
    now: number = 0;
    delta: number = 0;
    constructor(private readonly device: Device) { }
    tick() {
        this.now = this.device.now();
        this.delta = this.now - this.last;
        this.last = this.now;
    }
}