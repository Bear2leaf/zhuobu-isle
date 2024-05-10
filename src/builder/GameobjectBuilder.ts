import { UnencodedTileLayer } from "@kayahr/tiled";
import Gameobject from "../gameobject/Gameobject.js";
import Character from "../component/drawable/Character.js";
import Builder from "./Builder.js";
import Layer from "../component/drawable/Layer.js";
import WorkerMessageReceiver from "../component/receiver/WorkerMessageReceiver.js";
import CharacterInputReceiver from "../component/receiver/CharacterInputReceiver.js";

export default class GameobjectBuilder implements Builder<Gameobject> {
    private gameobject: Gameobject = new Gameobject();
    addPathReceiver() {
        const gameobject = this.gameobject;
        const comp = gameobject.add(WorkerMessageReceiver);
        comp.character = gameobject.get(Character)
    }
    addCharacter(context: WebGL2RenderingContext, textureName: string) {
        this.gameobject.add(CharacterInputReceiver)
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