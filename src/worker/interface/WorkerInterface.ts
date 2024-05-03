export default interface WorkerInterface {
    onmessage?: (data: any) => void;
    postmessage(data: any): void;
}