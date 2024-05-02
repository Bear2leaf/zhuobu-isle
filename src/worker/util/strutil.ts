
export function formatString(content: string, size: number) {
    return String("0".repeat(size) + content).slice(-size);
}