import Listener from "./Linstener.js";

export default  class InputListener extends Listener {
    set onclick (handler: (x: number, y: number) => void) {
        this.listeners["click"] = handler;
    }
    set ondrag (handler: (x: number, y: number) => void) {
        this.listeners["drag"] = handler;
    }
    set onrelease (handler: (x: number, y: number) => void) {
        this.listeners["release"] = handler;
    }
    get onclick() {
        return (x: number, y: number) => this.emit("click", x, y)
    }
    get ondrag() {
        return (x: number, y: number) => this.emit("drag", x, y)
    }
    get onrelease() {
        return (x: number, y: number) => this.emit("release", x, y)
    }
    protected emit(type: "click" | "drag" | "release", x: number, y: number): void {
        super.emit(type, x, y);
    }
}