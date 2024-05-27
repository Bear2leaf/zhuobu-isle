import MidiInstance from "../midi/MIDIInstance.js";
import AudioClip from "./AudioClip.js";
export default class MidiAudio implements AudioClip {
    private context?: AudioContext;
    private instance?: MidiInstance;
    private readonly midiName = "town_theme";
    private readonly soundfontNames =
        [
            "0000_GeneralUserGS",
            "0460_GeneralUserGS",
            "0730_GeneralUserGS"
        ];
    setContext(context: AudioContext) {
        this.context = context;
    }
    getContext() {
        if (this.context === undefined) {
            throw new Error("audiocontext not exist")
        }
        return this.context;
    }
    setInstance(instance: MidiInstance) {
        this.instance = instance;
    }
    getInstance() {
        if (this.instance === undefined) {
            this.instance = new MidiInstance(this.getContext());
        }
        return this.instance;
    }
    async load(/*cacheManager: CacheManager*/) {
        // await cacheManager.loadMidiCache(this.midiName);
        // await Promise.all(this.soundfontNames.map(name => cacheManager.loadSoundFontCache(name)));
        // const soundCache: Record<string, any> = {};
        // this.soundfontNames.forEach(name => {
        //     const soundfont = cacheManager.getSoundfont(name);
        //     if (soundfont === undefined) {
        //         throw new Error("soundfont not exist")
        //     }
        //     soundCache[`_tone_${name}_sf2_file`] = soundfont;
        // });
        // this.getInstance().setSoundCache(soundCache);
        // await this.getInstance().loadBuffer(cacheManager.getMidi(this.midiName));
    }
    init() {
        // this.playOnce();
    }

    update(): void {
        this.getInstance().loop();
        this.getInstance().tick();
    }

    playOnce() {
        this.getInstance().startPlay();
    }
}