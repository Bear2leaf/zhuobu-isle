

export type State = typeof initialState;

export type Action = {
    label: string,
    condition: (state: State) => boolean,
    effect: (state: State) => State,
    cost: (state: State) => number
}
export type Goal = {
    label: string,
    validate: (prev: State, next: State) => boolean
};

export const initialState = {
    axe_available: true,
    player: {
        axe_equipped: false,
        wood: 0
    }
};
export const actions: Action[] = [
    {
        label: "chopWood",
        condition: s => s.player.axe_equipped,
        effect: s => {
            s.player.wood++;
            return s;
        },
        cost: s => 2
    },
    {
        label: "getAxe",
        condition: s => !s.player.axe_equipped && s.axe_available,
        effect: s => {
            s.player.axe_equipped = true;
            return s;
        },
        cost: s => 2
    },
    {
        label: "gatherWood",
        condition: s => true,
        effect: s => {
            s.player.wood++;
            return s;
        },
        cost: s => 5
    }
];

export const goal: Goal = {
    label: "Collect Wood",
    validate: (prevState, nextState) => {
        return nextState.player.wood > prevState.player.wood;
    }
};