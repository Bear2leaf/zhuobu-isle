import Device from "../device/Device";
import { Map, TilesetRef, UnencodedTileLayer } from "@kayahr/tiled";
import Land from "../drawobject/Land";
import Character from "../drawobject/Character";
import Camera from "../camera/Camera";
import GameMap from "./GameMap";

export default class TiledMap implements GameMap {
    private readonly land: Land;
    private readonly character: Character;
    private sendmessage?: (data: MainMessage) => void;
    private get drawobjects() {
        return [
            this.land,
            this.character
        ]
    }
    constructor(context: WebGL2RenderingContext) {
        this.land = new Land(context)
        this.character = new Character(context);
    }
    worldPositionToTilePoint(x: number, y: number): Point {
        return {
            x: Math.floor(x),
            y: Math.floor(y)
        }
    }
    async load(name: string, device: Device): Promise<void> {
        const tiledMapData = await device.readJson(`resources/json/${name}.json`) as Map;
        this.sendmessage && this.sendmessage({
            type: "initTileMap",
            data: tiledMapData
        })
        const landLayer = tiledMapData.layers.find(layer => layer.name === "land");
        if (!landLayer) {
            throw new Error("land layer not found");
        }
        this.land.initLayerBuffer(landLayer as UnencodedTileLayer);
        const tileset = tiledMapData.tilesets && tiledMapData.tilesets[0];
        if (!tileset) {
            throw new Error("tileset name not found");
        }
        const source = (tileset as TilesetRef).source;
        await this.land.loadTexture(source.slice(source.lastIndexOf("\/") + 1, source.indexOf(".tsx")), device)
        for await (const drawobject of this.drawobjects) {
            await drawobject.load(device);
        }
    }
    onmessage(data: WorkerMessage) {
        for (const drawobject of this.drawobjects) {
            drawobject.onmessage(data);
        }
    }
    setSendMessage(sendmessage: (data: MainMessage) => void) {
        this.sendmessage = sendmessage;
        for (const drawobject of this.drawobjects) {
            drawobject.sendmessage = sendmessage;
        }
    }
    init() {
        for (const drawobject of this.drawobjects) {
            drawobject.init();
        }
    }
    onclick(x: number, y: number) {

        for (const drawobject of this.drawobjects) {
            drawobject.onclick(x, y);
        }
    }
    updateCamera(camera: Camera) {
        for (const drawobject of this.drawobjects) {
            camera.updateDrawobject(drawobject);
        }
    }
    update(now: number, delta: number) {
        for (const drawobject of this.drawobjects) {
            drawobject.update(now, delta);
        }
    }
    render() {
        for (const drawobject of this.drawobjects) {
            drawobject.draw();
        }
    }
}