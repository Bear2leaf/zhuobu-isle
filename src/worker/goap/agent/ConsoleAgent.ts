import Alea from "alea";
import Agent from "./Agent.js";
import { findPathToGround, findPathGroundTo, findPathToObject, removeStone as removeObject } from "../core/world.js";
import { ITEM_DATA, actions, goals, initialState } from "../core/data.js";
import { createPlan } from "../core/planner.js";

export default class ConsoleAgent implements Agent {

    readonly npc = { x: 32, y: 32 };
    currentPlan?: ReturnType<typeof createPlan>;
    iteration = 0;
    previousPlan?: ReturnType<typeof createPlan>;
    get currentAction() {
        return this.currentPlan ? this.currentPlan.actions[0] : undefined;
    };
    readonly initialState: typeof initialState = JSON.parse(JSON.stringify(initialState));
    private readonly rnd = Alea(10);
    update(): void {
        const npc = this.npc;
        if (this.currentAction === undefined) {
            const plan = goals
                .map(goal => createPlan(this.initialState, actions, goal))
                .sort((a, b) => (a ? a.cost || 0 : 0) - (b ? b.cost || 0 : 0))
                .shift();
            this.currentPlan = plan ? plan : undefined;
            if (this.currentAction === "goToWater") {
                this.onMoveAction({ npc, path: findPathToGround(npc, ITEM_DATA.NearWater[Math.floor(this.rnd.next() * ITEM_DATA.NearWater.length)]) });
            } else if (this.currentAction === "goToStone") {
                const config = { npc, path: findPathToObject(npc, ITEM_DATA.Stone[Math.floor(this.rnd.next() * ITEM_DATA.Stone.length)]) };
                this.onMoveAction(config);
            } else if (this.currentAction === "walkAround") {
                const rangeX = Math.floor(10 * (this.rnd.next() - 0.5));
                const rangeY = Math.floor(10 * (this.rnd.next() - 0.5));
                const position = { x: npc.x + rangeX, y: npc.y + rangeY }
                this.onMoveAction({ npc, path: findPathGroundTo(npc, position), onNoPath: () => actions.find(action => action.label === this.currentAction)?.effect(this.initialState) })
            } else if (this.currentAction === "gatherWater") {
                this.onAction(npc)
            } else if (this.currentAction === "gatherStone") {
                this.onAction(npc, () => {
                    removeObject(npc);
                })
            } else if (this.currentAction === "rest") {
                this.onAction(npc)
            }
            this.iteration++;
        }
    }
    onAction(npc: { x: number; y: number; }, onComplete?: VoidFunction | undefined): void {
        setTimeout(() => {
            const action = actions.find(action => action.label === this.currentAction)
            if (!action) {
                throw new Error("action is undefined");
            }
            action.effect(this.initialState);
            onComplete && onComplete();
            this.previousPlan = this.currentPlan;
            this.currentPlan = undefined;
        }, 100);
    }
    onMoveAction(config: { npc: { x: number; y: number; }, path?: { x: number; y: number; }[] | undefined, onComplete?: VoidFunction | undefined, onNoPath?: VoidFunction }): void {
        const { npc, path, onComplete, onNoPath } = config;
        if (path === undefined) {
            this.previousPlan = this.currentPlan;
            this.currentPlan = undefined;
            onNoPath && onNoPath();
            return;
        }
        const pos = path.shift();
        if (pos) {
            setTimeout(() => {
                this.npc.x = pos.x;
                this.npc.y = pos.y;
                this.onMoveAction({ npc, path, onComplete });
            }, 20);
        } else {
            const action = actions.find(action => action.label === this.currentAction)
            if (!action) {
                throw new Error("action is undefined");
            }
            action.effect(this.initialState);
            onComplete && onComplete();
            this.previousPlan = this.currentPlan;
            this.currentPlan = undefined;
        }
    }

}