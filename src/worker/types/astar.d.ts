declare module "javascript-astar" {
    export class Graph {
        grid: GridNode[][];
        constructor(grid: number[][], options?: { diagonal?: boolean | undefined });
    }

    export type GridNode = {
        x: number;
        y: number;
        weight: number;
    }

    export interface Heuristic {
        (pos0: { x: number; y: number }, pos1: { x: number; y: number }): number;
    }

    export interface Heuristics {
        manhattan: Heuristic;
        diagonal: Heuristic;
    }

    export const astar: {
        search: (
            graph: Graph,
            start: { x: number; y: number },
            end: { x: number; y: number },
            options?: {
                closest?: boolean | undefined;
                heuristic?: Heuristic | undefined;
            },
        ) => GridNode[];
        heuristics: Heuristics;
    }
}