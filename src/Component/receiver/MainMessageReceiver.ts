import Component from "../Component.js";
import Receiver from "./Receiver.js";

export default class MainMessageReceiver extends Component implements Receiver {
    mainMessage?: MainMessage;
    sendmessage?: (data: MainMessage) => void
    action(): void {
        if (!(this.sendmessage && this.mainMessage)) {
            return;
        }
        this.sendmessage(this.mainMessage)
    }
}