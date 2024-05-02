import Alea from "alea";

export default class SeedableRandom {
    private readonly prng;
    constructor(seed?: number) {
        this.prng = Alea(seed);

    }
    /** 
     * returns in range [0,1]
     */
    nextFloat() {
        return this.prng.next();
    }
    /**
     * returns in range [start, end): including start, excluding end
     * can't modulu nextInt because of weak randomness in lower bits
     */
    nextRange(start: number, end: number) {
        var rangeSize = end - start;
        var randomUnder1 = this.prng.next();
        return start + Math.floor(randomUnder1 * rangeSize);
    }
    choice<T>(array: T[]): T {
        return array[this.nextRange(0, array.length)];
    }

}