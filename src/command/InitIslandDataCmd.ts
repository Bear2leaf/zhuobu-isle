import Command from "./Command.js";
import { MainMessage } from "../device/Device.js";

export default class InitIslandDataCmd implements Command {
    constructor(
        private readonly data: number[],
        private readonly sendmessage: (data: MainMessage) => void
    ) {

    }
    execute(): void {
        this.sendmessage && this.sendmessage({
            type: "initIslandDataStart",
        });
        (async () => {
            const size = 1000;
            const stride = Math.ceil(this.data.length / size);
            let totalBatch = 0;
            for (let i = 0; i < size; i++) {
                totalBatch += await new Promise<number>((resolve) => {
                    setTimeout(() => {
                        const batch = this.data.slice(i * stride, (i + 1) * stride)
                        this.sendmessage && this.sendmessage({
                            type: "initIslandData",
                            data: batch
                        })
                        resolve(batch.length);
                    }, 50);
                });
            }
            console.log(totalBatch === this.data.length);
            this.sendmessage && this.sendmessage({
                type: "initIslandDataEnd",
            });
        })()
    }

}