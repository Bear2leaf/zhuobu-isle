import Gameobject from "../gameobject/Gameobject.js";
import Character from "../component/drawable/Character.js";
import Builder from "./Builder.js";
import Layer from "../component/drawable/Layer.js";
import Drawable from "../component/drawable/Drawable.js";
import TiledMap from "../tiled/TiledMap.js";

export default class GameobjectBuilder implements Builder<Gameobject> {
    private gameobject: Gameobject = new Gameobject();
    private context?: WebGL2RenderingContext;
    private canvas2dContext?: CanvasRenderingContext2D;
    addCharacter() {
        const context = this.context;
        if (!context) {
            throw new Error("context is undefined");
        }
        this.gameobject.add(Character);
        return this;
    }
    setTiledMap(tiledMap: TiledMap) {
        this.gameobject.get(Layer).setTiledMap(tiledMap)
    }
    setLayerIndex(index: number) {
        this.gameobject.get(Layer).setLayerIndex(index)
        this.gameobject.get(Layer).initTexture();
    }
    addLayer() {
        const context = this.context;
        if (!context) {
            throw new Error("context is undefined");
        }
        this.gameobject.add(Layer);
        return this;
    }
    initRenderer() {
        const context = this.context;
        if (!context) {
            throw new Error("context is undefined");
        }
        this.gameobject.get(Drawable).initRenderer(context)
    }
    initFontCanvas() {
        const canvas2dContext = this.canvas2dContext;
        if (!canvas2dContext) {
            throw new Error("canvas2dContext is undefined");
        }
        this.gameobject.get(Drawable).initFontCanvas(canvas2dContext)
    }
    setContext(context: WebGL2RenderingContext) {
        this.context = context;
        return this;
    }
    setFontCanvasContext(context: CanvasRenderingContext2D) {
        this.canvas2dContext = context;
        return this;
    }
    build(): Gameobject {
        const result = this.gameobject;
        this.gameobject = new Gameobject();
        return result;
    }

}