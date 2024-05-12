import Device from "../device/Device";
import Camera from "../camera/Camera";
import Gameobject from "../gameobject/Gameobject.js";
import Drawable from "../component/drawable/Drawable.js";
import Component from "../component/Component.js";

export default class Scene {
    protected readonly gameobjects: Gameobject[];
    constructor() {
        this.gameobjects = [];
    }
    async load(device: Device): Promise<void> {
        for await (const object of this.gameobjects) {
            await Promise.all(object.all().map(comp => comp.load(device)));
        }
    }
    initGameobjects() {
        for (const object of this.gameobjects) {
            object.all().map(comp => comp.init());
        }
    }
    getComponents<T extends Component>(ctor: new () => T): T[] {
        return this.gameobjects.filter(obj => obj.has(ctor)).map(obj => obj.get(ctor));
    }
    updateCamera(camera: Camera) {
        for (const object of this.gameobjects) {
            camera.updateDrawable(object.get(Drawable));
        }
    }
    update(now: number, delta: number) {
        for (const object of this.gameobjects) {
            object.all().map(comp => comp.update(now, delta));
        }
    }
    render() {
        for (const object of this.gameobjects) {
            object.get(Drawable).draw();
        }
    }
}