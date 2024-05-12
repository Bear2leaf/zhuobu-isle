import { UnencodedTileLayer } from "@kayahr/tiled";
import Gameobject from "../gameobject/Gameobject.js";
import Character from "../component/drawable/Character.js";
import Builder from "./Builder.js";
import Layer from "../component/drawable/Layer.js";

export default class GameobjectBuilder implements Builder<Gameobject> {
    private gameobject: Gameobject = new Gameobject();
    private context?: WebGL2RenderingContext;
    addCharacter(textureName: string) {
        const context = this.context;
        if (!context) {
            throw new Error("context is undefined");
        }
        const comp = this.gameobject.add(Character);
        comp.initRenderer(context)
        comp.setTextureName(textureName);
    }
    addLayer(textureName: string, data: UnencodedTileLayer, firstgrid?: number) {
        const context = this.context;
        if (!context) {
            throw new Error("context is undefined");
        }
        const comp = this.gameobject.add(Layer);
        comp.initRenderer(context)
        comp.setTextureName(textureName);
        comp.setData(data, firstgrid)
    }
    setContext(context: WebGL2RenderingContext) {
        this.context = context;
        return this;
    }
    build(): Gameobject {
        const result = this.gameobject;
        this.gameobject = new Gameobject();
        return result;
    }

}