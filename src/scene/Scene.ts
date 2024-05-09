import Device from "../device/Device";
import Camera from "../camera/Camera";
import GameobjectBuilder from "../Component/builder/GameobjectBuilder.js";
import Gameobject from "../gameobject/Gameobject.js";
import Drawable from "../Component/drawable/Drawable.js";
import Component from "../Component/Component.js";

export default  class Scene {
    protected readonly gameobject: Gameobject[];
    protected readonly builder: GameobjectBuilder;
    constructor() {
        this.gameobject = [];
        this.builder = new GameobjectBuilder();
    }
    async load(device: Device): Promise<void> {
        for await (const object of this.gameobject) {
            await Promise.all(object.all().map(comp => comp.load(device)));
        }
    }
    init() {
        for (const object of this.gameobject) {
            object.all().map(comp=> comp.init());
        }
    }
    getComponents<T extends Component>(ctor: new () => T) {
        return this.gameobject.filter(obj => obj.has(ctor)).map(obj => obj.get(ctor));
    }
    updateCamera(camera: Camera) {
        for (const object of this.gameobject) {
            camera.updateDrawable(object.get(Drawable));
        }
    }
    update(now: number, delta: number) {
        for (const object of this.gameobject) {
            object.all().map(comp=> comp.update(now, delta));
        }
    }
    render() {
        for (const object of this.gameobject) {
            object.get(Drawable).draw();
        }
    }
}