import Component from "../Component.js";

export default abstract class Listener extends Component {
    private readonly queue: { type: string, args: any[] }[] = [];
    protected listeners: Record<string, (...args: any[]) => void> = {}
    protected emit(type: string, ...args: any[]) {
        this.queue.push({ type, args })
    }
    update(elapsed: number, delta: number): void {
        let event = this.queue.shift();
        while (event) {
            this.listeners[event.type](...event.args);
            event = this.queue.shift();
        }
    }
}