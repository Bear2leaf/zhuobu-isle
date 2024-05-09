import { UnencodedTileLayer } from "@kayahr/tiled";
import Gameobject from "../../gameobject/Gameobject.js";
import Character from "../drawable/Character.js";
import InputListener from "../listener/InputListener.js";
import MessageListener from "../listener/MessageListener.js";
import Builder from "./Builder.js";
import Layer from "../drawable/Layer.js";

export default class GameobjectBuilder implements Builder<Gameobject> {
    private gameobject: Gameobject = new Gameobject();
    addInputListener() {
        const comp = this.gameobject.add(InputListener);
        comp.onclick = (x: number, y: number) => { }
        comp.ondrag = (x: number, y: number) => { }
        comp.onrelease = (x: number, y: number) => { }
    }
    addMessageListener() {
        const gameobject = this.gameobject;
        const comp = gameobject.add(MessageListener);
        if (gameobject.has(Character)) {
            comp.onmessage = data => {
                if (data.type === "path") {
                    gameobject.get(Character).processPath(data.data)
                }
            }
        } else {
            comp.onmessage = data => {
            }
        }

    }
    addCharacter(context: WebGL2RenderingContext, textureName: string) {
        const comp = this.gameobject.add(Character);
        comp.initRenderer(context)
        comp.setTextureName(textureName);
    }
    addLayer(context: WebGL2RenderingContext, textureName: string, data: UnencodedTileLayer, firstgrid?: number) {
        const comp = this.gameobject.add(Layer);
        comp.initRenderer(context)
        comp.setTextureName(textureName);
        comp.setData(data, firstgrid)
    }
    build(): Gameobject {
        const result = this.gameobject;
        this.gameobject = new Gameobject();
        return result;
    }

}