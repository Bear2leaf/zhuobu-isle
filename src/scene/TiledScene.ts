import Device from "../device/Device";
import { AnyLayer, EmbeddedTileset, Map, Tileset, TilesetRef, UnencodedTileLayer } from "@kayahr/tiled";
import Layer from "../drawobject/Layer";
import Character from "../drawobject/Character";
import Camera from "../camera/Camera";
import Scene from "./Scene";

export default class TiledScene implements Scene {
    private readonly drawobjects: Layer[];
    private sendmessage?: (data: MainMessage) => void;
    constructor(context: WebGL2RenderingContext) {
        this.drawobjects = [
            new Layer(context),
            new Layer(context),
            new Layer(context),
            new Character(context),
            new Layer(context),
        ];
    }
    async load(name: string, device: Device): Promise<void> {
        const tiledMapData = await device.readJson(`resources/tiled/${name}.json`) as Map;
        this.sendmessage && this.sendmessage({
            type: "initTileMap",
            data: tiledMapData
        })
        const layers = tiledMapData.layers as UnencodedTileLayer[];
        for await (const layer of layers) {
            const layerobject = this.drawobjects[layers.indexOf(layer)];
            if (!layerobject) {
                continue;
            }
            const image = this.getTilesetImage(tiledMapData, layer)
            const firstgrid = this.getTilesetFirstgrid(tiledMapData, layer)
            layerobject.setTextureName(`..\/${image}`.split(".png")[0]);
            layerobject.setData(layer, firstgrid);
            await layerobject.load(device);
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
                return image;
            }
        }
    }
    onmessage(data: WorkerMessage) {
        for (const drawobject of this.drawobjects) {
            drawobject.onmessage(data);
        }
    }
    initEvents(device: Device) {
        this.sendmessage = device.sendmessage?.bind(device);
        for (const drawobject of this.drawobjects) {
            drawobject.sendmessage = device.sendmessage?.bind(device);
        }
    }
    init() {
        for (const drawobject of this.drawobjects) {
            drawobject.initLayerBuffer();
            drawobject.init();
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