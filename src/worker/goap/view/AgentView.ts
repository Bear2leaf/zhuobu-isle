import Agent from "../agent/Agent.js";
import View from "./View.js";

export default class AgentView implements View {
    constructor(private readonly agent: Agent) {

    }
    update() {
        const agent = this.agent;
        console.log([
            `[Iterations] - ${agent.iteration}`,
            `[Position] - [${agent.npc.x}, ${agent.npc.y}]`,
            `[States]`,
            ...Object.keys(agent.initialState.character).map(key => `-${key}:${agent.initialState.character[key as keyof typeof agent.initialState.character]}`),
            `[CurrentAction]`,
            ` ${agent.currentAction ? agent.currentAction : ''}`,
            `[PreviousPlan]`,
            ` ${agent.previousPlan ? agent.previousPlan.goal.label : ''}`,
            `[CurrentPlanGoal]`,
            ` ${agent.currentPlan ? agent.currentPlan.goal.label : ''}`,
            // `[CurrentPlanActions]`,
            // ` ${agent.currentPlan ? agent.currentPlan.actions.join("\n ") : ''}`,
            `[CurrentPlanCost]`,
            ` ${agent.currentPlan ? agent.currentPlan.cost : ''}`,
        ].join("\n"));
    }
}