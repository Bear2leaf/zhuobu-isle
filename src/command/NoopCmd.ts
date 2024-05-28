import Command from "./Command.js";

export default class NoopCmd implements Command {
    execute(): void {
    }

}