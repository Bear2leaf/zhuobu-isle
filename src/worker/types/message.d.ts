declare type WorkerMessage = {
    type: "worker"
    data: number[]
} | {
    type: "path",
    data: Point[]
}
declare type Point = {
    x: number,
    y: number
}
declare type MainMessage = {
    type: "hello"
} | {
    type: "initTileMap",
    data: any
} | {
    type: "findPath",
    data: {
        start: Point,
        end: Point
    }
}