declare type WorkerMessage = {
    type: "worker"
    data: number[]
} | {
    type: "path",
    data: [number, number][]
}
declare type MainMessage = {
    type: "hello"
    data: void
} | {
    type: "initTileMap",
    data: any
} | {
    type: "plan",
    data: void
} | {
    type: "findPath",
    data: {
        start: [number, number],
        end: [number, number]
    }
}