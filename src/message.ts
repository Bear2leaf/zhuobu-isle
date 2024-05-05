
export type WorkerMessage = {
    type: "worker"
    data: number[]
}

export type MainMessage = {
    type: "hello"
}