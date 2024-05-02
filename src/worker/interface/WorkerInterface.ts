export default interface WorkerInterface {
    onmessage?: (data: any) => void;
    emit(data: any): void;
}