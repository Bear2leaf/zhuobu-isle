import AgentView from "./view/AgentView.js";
import ConsoleAgent from "./agent/ConsoleAgent.js";
import { generateStone, initLayers } from "./core/world.js";
import WorldView from "./view/WorldView.js";
initLayers();
const agent = new ConsoleAgent();
const viewer = new AgentView(agent);
const worldViewer = new WorldView(agent);
for (let index = 0; index < 5; index++) {
    generateStone({x: 32, y: 32});
}
setInterval(() => {
    console.clear();
    worldViewer.update();
    agent.update();
    viewer.update();
}, 20);
