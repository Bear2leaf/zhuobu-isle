import Component from "../Component/Component.js";

export default class Gameobject {
    private readonly components: Component[];
    constructor() {
        this.components = [];
    }
    get<T extends Component>(ctor: new () => T): T {
        for (const component of this.components) {
            if (component instanceof ctor) {
                return component;
            }
        }
        throw new Error("could not find component " + ctor.name)
    }
    add<T extends Component>(ctor: new () => T): T {
        for (const component of this.components) {
            if (component instanceof ctor) {
                throw new Error(`Component ${ctor.name} already exist.`)
            }
        }
        const comp = new ctor();
        this.components.push(comp);
        return comp;
    }
    has<T extends Component>(ctor: new () => T): boolean {
        for (const component of this.components) {
            if (component instanceof ctor) {
                return true;
            }
        }
        return false;
    }
    all(): readonly Component[] {
        return this.components;
    }
    update(elapsed: number, delta: number) {
        for (const component of this.components) {
            component.update(elapsed, delta);
        }
    }
}