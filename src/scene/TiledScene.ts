import Device from "../device/Device";
import { EmbeddedTileset, Map, UnencodedTileLayer } from "@kayahr/tiled";
import Layer from "../Component/drawable/Layer";
import Camera from "../camera/Camera";
import Scene from "./Scene";
import GameobjectBuilder from "../Component/builder/GameobjectBuilder.js";
import Gameobject from "../gameobject/Gameobject.js";
import MessageListener from "../Component/listener/MessageListener.js";
import InputListener from "../Component/listener/InputListener.js";

export default class TiledScene implements Scene {
    private readonly gameobject: Gameobject[];
    private readonly builder: GameobjectBuilder;
    sendmessage?: (data: MainMessage) => void;
    constructor(private readonly tiledMapData: Map) {
        this.gameobject = [];
        this.builder = new GameobjectBuilder();
    }
    buildScene(context: WebGL2RenderingContext) {
        const tiledMapData = this.tiledMapData;
        if (!tiledMapData) {
            throw new Error("tiledMapData is undefined");
        }
        this.sendmessage && this.sendmessage({
            type: "initTileMap",
            data: tiledMapData
        })
        const layers = tiledMapData.layers as UnencodedTileLayer[];
        const builder = this.builder;
        for (const layer of layers) {
            const image = this.getTilesetImage(tiledMapData, layer)
            const firstgrid = this.getTilesetFirstgrid(tiledMapData, layer)
            if (layer.name === "character") {
                builder.addCharacter(context, image)
            } else {
                builder.addLayer(context, image, layer, firstgrid);
            }
            builder.addInputListener()
            builder.addMessageListener()
            this.gameobject.push(builder.build());
        }
    }
    async load(device: Device): Promise<void> {
        for await (const object of this.gameobject) {
            await object.get(Layer).load(device);
        }
    }
    private getTilesetFirstgrid(tiledMapData: Map, layer: UnencodedTileLayer) {
        for (const tileset of tiledMapData.tilesets as EmbeddedTileset[]) {
            const match = layer.data?.every(tile => !tile || (tileset.firstgid <= tile && tile < tileset.firstgid + tileset.tilecount))
            if (match) {
                const firstgid = (tileset as EmbeddedTileset).firstgid;
                return firstgid;
            }
        }
    }
    private getTilesetImage(tiledMapData: Map, layer: UnencodedTileLayer) {
        for (const tileset of tiledMapData.tilesets as EmbeddedTileset[]) {
            const match = layer.data?.every(tile => !tile || (tileset.firstgid <= tile && tile < tileset.firstgid + tileset.tilecount))
            if (match) {
                const image = (tileset as EmbeddedTileset).image;
                const imagePaths = `${image}`.split('\/');
                const imageName = imagePaths[imagePaths.length - 1].replace(".png","");
                return imageName;
            }
        }
        throw new Error("image not found")
    }
    onmessage(data: WorkerMessage) {
        for (const object of this.gameobject) {
            object.get(MessageListener).onmessage(data);
        }
    }
    init() {
        for (const object of this.gameobject) {
            object.get(Layer).init();
        }
    }
    onclick(x: number, y: number) {
        this.sendmessage && this.sendmessage({
            type: "findPath",
            data: {
                start: {
                    x: Math.floor(0),
                    y: Math.floor(0)
                },
                end: {
                    x: Math.floor(x),
                    y: Math.floor(y)
                }
            }
        });
        for (const drawobject of this.gameobject) {
            drawobject.get(InputListener).onclick(x, y);
        }
    }
    updateCamera(camera: Camera) {
        for (const object of this.gameobject) {
            camera.updateDrawable(object.get(Layer));
        }
    }
    update(now: number, delta: number) {
        for (const object of this.gameobject) {
            object.update(now, delta);
        }
    }
    render() {
        for (const object of this.gameobject) {
            object.get(Layer).draw();
        }
    }
}