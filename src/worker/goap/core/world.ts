import Alea from "alea";
import { Graph, GridNode, astar } from "javascript-astar";
import { ITEM_DATA, groundLayerRaw, objectLayerRaw } from "./data.js";
import PoissonDiskSampling from "poisson-disk-sampling";




export const stones = [0]

type Point = { x: number, y: number }
const rnd = Alea(666);
const sampling = new PoissonDiskSampling({
    shape: [64, 64],
    minDistance: 1,
}, () => rnd.next())
const layers: [number[][], number[][]] = [[], []]
export function initLayers(groundLayer: number[][] = groundLayerRaw, objectLayer: number[][] = objectLayerRaw) {
    layers[0] = groundLayer;
    layers[1] = objectLayer;
    for (let i = 0; i < groundLayer.length; i++) {
        for (let j = 0; j < groundLayer[i].length; j++) {
            const element = groundLayer[i][j];
            groundLayer[i][j] = ITEM_DATA.Water.indexOf(element) !== -1 ? 0 : element
        }

    }
}
export function generateStone(from: Point): Point {
    const [groundLayer, objectLayer] = layers;
    const row = Math.floor(objectLayer.length * rnd.next())
    const col = Math.floor(objectLayer[0].length * rnd.next())
    const valid = findPathGroundTo(from, { x: col, y: row });
    if (valid) {
        stones[0] += 1;
        objectLayer[row][col] = ITEM_DATA.Stone[Math.floor(ITEM_DATA.Stone.length * rnd.next())];
        return { y: row, x: col }
    } else {
        return generateStone(from);
    }
}
export function findPathToObject(from: Point, to: number): Point[] | undefined {
    const [groundLayer, objectLayer] = layers;
    const graph = new Graph(objectLayer);
    let startNode: GridNode | undefined;
    let endNode: GridNode | undefined;
    let [x, y] = sampling.addRandomPoint().map(p => Math.floor(p));
    while (graph.grid[y][x].weight !== to) {
        [x, y] = sampling.addRandomPoint().map(p => Math.floor(p));
    }
    endNode = graph.grid[y][x]
    startNode = graph.grid[from.y][from.x];
    if (startNode === undefined || endNode === undefined) {
        return;
    }
    const groundPath = findPathGroundTo({ x: startNode.y, y: startNode.x }, { x: endNode.y, y: endNode.x });
    // console.log(from, to)
    // const graphA = new Graph(groundLayer);
    // console.log(graphA.grid[Math.floor(startNode.x)][Math.floor(startNode.y)]);
    // console.log(graphA.grid[Math.floor(endNode.x)][Math.floor(endNode.y)]);
    if (groundPath === undefined) {
        return;
    }
    const path = astar.search(graph, startNode, endNode);
    if (path.length === 0) {
        return;
    } else {
        return path.map(p => ({ x: p.y, y: p.x }))
    }
}
export function findPathToGround(from: Point, to: number): Point[] | undefined {
    const [groundLayer, objectLayer] = layers;
    const graph = new Graph(groundLayer);
    let startNode: GridNode | undefined;
    let endNode: GridNode | undefined;
    let [x, y] = sampling.addRandomPoint().map(p => Math.floor(p));
    while (graph.grid[y][x].weight !== to) {
        [x, y] = sampling.addRandomPoint().map(p => Math.floor(p));
    }
    endNode = graph.grid[y][x]
    startNode = graph.grid[from.y][from.x];
    if (startNode === undefined || endNode === undefined) {
        return;
    }
    const path = astar.search(graph, startNode, endNode);
    if (path.length === 0) {
        return;
    } else {
        return path.map(p => ({ x: p.y, y: p.x }))
    }
}
export function findPathGroundTo(from: Point, to: Point): Point[] | undefined {
    const [groundLayer, objectLayer] = layers;
    const graph = new Graph(groundLayer);
    let startNode: GridNode | undefined;
    let endNode: GridNode | undefined;
    startNode = graph.grid[from.y][from.x];
    endNode = graph.grid[to.y][to.x];
    if (startNode === undefined || endNode === undefined) {
        return;
    }
    const path = astar.search(graph, startNode, endNode);
    if (path.length === 0) {
        return;
    } else {
        return path.map(p => ({ x: p.y, y: p.x }))
    }
}
export function removeStone(from: Point): void {
    const [groundLayer, objectLayer] = layers;
    objectLayer[from.y][from.x] = ITEM_DATA.Transparent[0];
    stones[0] -= 1;
    if (stones[0] === 0) {
        generateStone(from);
    }
}