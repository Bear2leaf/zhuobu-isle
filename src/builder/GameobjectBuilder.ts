import Gameobject from "../gameobject/Gameobject.js";
import Character from "../component/drawable/Character.js";
import Builder from "./Builder.js";
import Layer from "../component/drawable/Layer.js";
import Drawable from "../component/drawable/Drawable.js";
import Tilemap from "../tiled/Tilemap.js";
import Island from "../component/drawable/Island.js";

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
    addIsland() {
        const context = this.context;
        if (!context) {
            throw new Error("context is undefined");
        }
        this.gameobject.add(Island);
        return this;
    }
    setTiledMap(tiledMap: Tilemap) {
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
        const context = this.context;
        if (!context) {
            throw new Error("context is undefined");
        }
        const canvas2dContext = this.canvas2dContext;
        if (!canvas2dContext) {
            throw new Error("canvas2dContext is undefined");
        }
        this.gameobject.get(Drawable).initFontCanvas(context, canvas2dContext)
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