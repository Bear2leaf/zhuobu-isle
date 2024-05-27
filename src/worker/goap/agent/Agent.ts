import { initialState } from "../core/data.js";
import { createPlan } from "../core/planner.js";

type Point = { x: number, y: number };
export default interface Agent {
    npc: Point;
    previousPlan?: ReturnType<typeof createPlan>;
    currentPlan?: ReturnType<typeof createPlan>;
    iteration: number;
    currentAction: string | undefined;
    readonly initialState: typeof initialState;
    update(npc: Point): void;
    onAction(npc: Point, onComplete?: VoidFunction): void;
    onMoveAction(config:{npc: { x: number; y: number; }, path?: { x: number; y: number; }[] | undefined, onComplete?: VoidFunction | undefined, onNoPath?: VoidFunction}): void
}