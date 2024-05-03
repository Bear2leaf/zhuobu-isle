declare type WorkerMessage = {
    type: "worker"
    data: number[]
}

declare type MainMessage = {
    type: "hello"
}