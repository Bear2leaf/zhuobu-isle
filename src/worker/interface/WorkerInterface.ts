export default interface WorkerInterface {
    onmessage?: (data: MainMessage) => void;
    postmessage(data: WorkerMessage): void;
}