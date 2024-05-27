import BleepAudio from "../audio/BleepAudio.js";
import DemoAudio from "../audio/DemoAudio.js";
import MidiAudio from "../audio/MidiAudio.js";
import Device from "../device/Device.js";
export default class AudioManager {
    private readonly demoAudio = new DemoAudio;
    private readonly bleepAudio = new BleepAudio;
    private readonly midiAudio = new MidiAudio;
    private device?: Device;
    getDevice(): Device {
        if (this.device === undefined) {
            throw new Error("device is undefined");
        }
        return this.device;
    }
    setDevice(device: Device) {
        this.device = device;
    }
    async load(): Promise<void> {
        // await this.getCacheManager().loadWavCache("bleep");
        // this.bleepAudio.setBuffer(this.getCacheManager().getWav("bleep"));
        // await this.midiAudio.load(this.getCacheManager());
    }
    initAudioContext() {
        const context = this.getDevice().createWebAudioContext();
        [
            this.demoAudio,
            this.bleepAudio,
            this.midiAudio
        ].forEach(clip => {
            clip.setContext(context)
        });
    }
    initAudio() {
        [
            this.demoAudio,
            this.bleepAudio,
            this.midiAudio
        ].forEach(clip => {
            clip.init();
        });
    }
    process() {
        [
            this.demoAudio,
            this.bleepAudio,
            this.midiAudio
        ].forEach(clip => {
            clip.update();
        });
    }

}


