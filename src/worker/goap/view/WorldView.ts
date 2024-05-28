import { pad } from "lodash";
import { stones } from "../core/world.js";
import View from "./View.js";
import Agent from "../agent/Agent.js";
import { groundLayerRaw, objectLayerRaw } from "../core/data.js";

export default class WorldView implements View {
    constructor(private readonly agent: Agent) {

    }
    update() {
        let msg = "";

        msg += `[World]`,
            msg += `[Stones]: ${stones[0]}`,
            msg += `\n`;
        msg += `[Map]\n`;

        // for (let i = 0; i < groundLayerRaw.length; i++) {
        //     for (let j = 0; j < groundLayerRaw[i].length; j++) {
        //         if (Math.floor(this.agent.npc.x) === j && Math.floor(this.agent.npc.y) === i) {
        //             msg += pad(`🐱`, 3);
        //         } else {
        //             msg += pad(`${groundLayerRaw[i][j].toString(16)}`, 4);
        //         }

        //     }
        //     msg += `\n`;
        // }
        // msg += `\n`;
        for (let i = 0; i < objectLayerRaw.length; i++) {
            for (let j = 0; j < objectLayerRaw[i].length; j++) {
                if (objectLayerRaw[i][j] === 206) {
                    msg += pad(`🪨`, 4);
                } else if (this.agent.npc.x === j && this.agent.npc.y === i) {
                    msg += pad(`🐱`, 3);
                } else {
                    msg += pad(`${objectLayerRaw[i][j].toString(16)}`, 4);
                }
            }
            msg += `\n`;
        }
        console.log(msg);
    }
}