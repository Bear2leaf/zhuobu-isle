import _ from "lodash";
import PriorityQueue from "fastpriorityqueue";
import { State, Action, Goal } from "./data";
class Node {
  cost: number;
  parent?: Node;
  state: State;
  action?: Action;
  constructor(cost: number, state: State, action?: Action, parent?: Node,) {
    this.cost = cost;
    this.parent = parent;
    this.state = _.merge({}, state);
    this.action = action;
  }
}


const buildGraph = (parent: Node, leaves: PriorityQueue<Node>, actions: Action[], goal: Goal) => {
  actions.forEach(action => {
    if (action.condition(parent.state)) {
      let nextState = action.effect(_.merge({}, parent.state));
      const cost = parent.cost + action.cost(nextState);
      const node = new Node(cost, nextState, action, parent);
      if (goal.validate(parent.state, nextState)) {
        leaves.add(node);
      } else {
        const subset = actions.filter(a => a.label !== action.label);
        return buildGraph(node, leaves, subset, goal);
      }
    }
  });
  return leaves;
};

const getPlanFromLeaf = (goal: Goal, node?: Node) => {
  const plan = [];
  const cost = node?.cost;
  while (node) {
    if (node.action) plan.unshift(node.action);
    node = node.parent;
  }
  return {
    cost,
    goal,
    actions: plan.map(n => n.label)
  };
};

export const createPlan = (state: State, actions: Action[], goal: Goal) => {
  const root = new Node(0, state);
  const leaves = new PriorityQueue<Node>((a, b) => a.cost < b.cost);
  buildGraph(root, leaves, actions, goal);
  if (!leaves.isEmpty()) return getPlanFromLeaf(goal, leaves.poll());
};
