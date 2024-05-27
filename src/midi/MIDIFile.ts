import { EventType } from "./MIDIType.js";
import { MIDIEvents } from "./MIDIEvents.js";
import { MIDIFileHeader } from "./MIDIFileHeader.js";
import { MIDIFileTrack } from "./MIDIFileTrack.js";
/**
 * Implementation of atob() according to the HTML and Infra specs, except that
 * instead of throwing INVALID_CHARACTER_ERR we return null.
 */
export function atob(data: string) {
    if (arguments.length === 0) {
        throw new TypeError("1 argument required, but only 0 present.");
    }

    // Web IDL requires DOMStrings to just be converted using ECMAScript
    // ToString, which in our case amounts to using a template literal.
    data = `${data}`;
    // "Remove all ASCII whitespace from data."
    data = data.replace(/[ \t\n\f\r]/g, "");
    // "If data's code point length divides by 4 leaving no remainder, then: if data ends
    // with one or two U+003D (=) code points, then remove them from data."
    if (data.length % 4 === 0) {
        data = data.replace(/==?$/, "");
    }
    // "If data's code point length divides by 4 leaving a remainder of 1, then return
    // failure."
    //
    // "If data contains a code point that is not one of
    //
    // U+002B (+)
    // U+002F (/)
    // ASCII alphanumeric
    //
    // then return failure."
    if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
        throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    // "Let output be an empty byte sequence."
    let output = "";
    // "Let buffer be an empty buffer that can have bits appended to it."
    //
    // We append bits via left-shift and or.  accumulatedBits is used to track
    // when we've gotten to 24 bits.
    let buffer = 0;
    let accumulatedBits = 0;
    // "Let position be a position variable for data, initially pointing at the
    // start of data."
    //
    // "While position does not point past the end of data:"
    for (let i = 0; i < data.length; i++) {
        // "Find the code point pointed to by position in the second column of
        // Table 1: The Base 64 Alphabet of RFC 4648. Let n be the number given in
        // the first cell of the same row.
        //
        // "Append to buffer the six bits corresponding to n, most significant bit
        // first."
        //
        // atobLookup() implements the table from RFC 4648.
        buffer <<= 6;
        buffer |= atobLookup(data[i]);
        accumulatedBits += 6;
        // "If buffer has accumulated 24 bits, interpret them as three 8-bit
        // big-endian numbers. Append three bytes with values equal to those
        // numbers to output, in the same order, and then empty buffer."
        if (accumulatedBits === 24) {
            output += String.fromCharCode((buffer & 0xff0000) >> 16);
            output += String.fromCharCode((buffer & 0xff00) >> 8);
            output += String.fromCharCode(buffer & 0xff);
            buffer = accumulatedBits = 0;
        }
        // "Advance position by 1."
    }
    // "If buffer is not empty, it contains either 12 or 18 bits. If it contains
    // 12 bits, then discard the last four and interpret the remaining eight as
    // an 8-bit big-endian number. If it contains 18 bits, then discard the last
    // two and interpret the remaining 16 as two 8-bit big-endian numbers. Append
    // the one or two bytes with values equal to those one or two numbers to
    // output, in the same order."
    if (accumulatedBits === 12) {
        buffer >>= 4;
        output += String.fromCharCode(buffer);
    } else if (accumulatedBits === 18) {
        buffer >>= 2;
        output += String.fromCharCode((buffer & 0xff00) >> 8);
        output += String.fromCharCode(buffer & 0xff);
    }
    // "Return output."
    return output;
}
/**
 * A lookup table for atob(), which converts an ASCII character to the
 * corresponding six-bit number.
 */

const keystr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function atobLookup(chr: string) {
    const index = keystr.indexOf(chr);
    // Throw exception if character is not in the lookup string; should not be hit in tests
    if (index === -1) {
        throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    return index;
}

///...........................................


// MIDIFile : Read (and soon edit) a MIDI file in a given ArrayBuffer


function ensureArrayBuffer(buf: ArrayBuffer | Uint8Array) {
    if (buf) {
        if (buf instanceof ArrayBuffer) {
            return buf;
        }
        if (buf instanceof Uint8Array) {
            // Copy/convert to standard Uint8Array, because derived classes like
            // node.js Buffers might have unexpected data in the .buffer property.
            return new Uint8Array(buf).buffer;
        }
    }
    throw new Error('Unsupported buffer type, need ArrayBuffer or Uint8Array');
}

// Constructor
export default class MIDIFile {
    private readonly header: MIDIFileHeader;
    private readonly tracks: MIDIFileTrack[];
    constructor(buffer?: ArrayBuffer, strictMode: boolean = false) {
        let track;
        let curIndex;

        // If not buffer given, creating a new MIDI file
        if (!buffer) {
            // Creating the content
            this.header = new MIDIFileHeader();
            this.tracks = [new MIDIFileTrack()];
            // if a buffer is provided, parsing him
        } else {
            buffer = ensureArrayBuffer(buffer);
            // Minimum MIDI file size is a headerChunk size (14bytes)
            // and an empty track (8+3bytes)
            if (25 > buffer.byteLength) {
                throw new Error('A buffer of a valid MIDI file must have, at least, a' +
                    ' size of 25bytes.');
            }
            // Reading header
            this.header = new MIDIFileHeader(buffer, strictMode);
            this.tracks = [];
            curIndex = MIDIFileHeader.HEADER_LENGTH;
            // Reading tracks
            for (let i = 0, j = this.header.getTracksCount(); i < j; i++) {
                // Testing the buffer length
                if (strictMode && curIndex >= buffer.byteLength - 1) {
                    throw new Error('Couldn\'t find datas corresponding to the track #' + i + '.');
                }
                // Creating the track object
                track = new MIDIFileTrack(buffer, curIndex, strictMode);
                this.tracks.push(track);
                // Updating index to the track end
                curIndex += track.getTrackLength() + 8;
            }
            // Testing integrity : curIndex should be at the end of the buffer
            if (strictMode && curIndex !== buffer.byteLength) {
                throw new Error('It seems that the buffer contains too much datas.');
            }
        }
    }
    startNote(event: EventType, song: Record<string, any>) {
        const track = this.takeTrack(event.channel, song);
        track.notes.push({
            when: event.playTime / 1000,
            pitch: event.param1,
            velocity: Math.pow(event.param2 / 127, 2),
            duration: 0.0000001,
            slides: []
        });
    }
    closeNote(event: EventType, song: Record<string, any>) {
        const track = this.takeTrack(event.channel, song);
        for (let i = 0; i < track.notes.length; i++) {
            if (track.notes[i].duration == 0.0000001 //
                && track.notes[i].pitch == event.param1 //
                && track.notes[i].when < event.playTime / 1000) {
                track.notes[i].duration = event.playTime / 1000 - track.notes[i].when;
                break;
            }
        }
    }
    addSlide(event: EventType, song: Record<string, any>, pitchBendRange: number) {
        const track = this.takeTrack(event.channel, song);
        for (let i = 0; i < track.notes.length; i++) {
            if (track.notes[i].duration == 0.0000001 //
                && track.notes[i].when < event.playTime / 1000) {
                track.notes[i].slides.push({
                    delta: (event.param2 - 64) / 64 * pitchBendRange,
                    when: event.playTime / 1000 - track.notes[i].when
                });
            }
        }
    }
    startDrum(event: EventType, song: Record<string, any>) {
        const beat = this.takeBeat(event.param1, song);
        beat.notes.push({
            when: event.playTime / 1000
        });
    }
    takeTrack(n: number, song: Record<string, any>) {
        for (let i = 0; i < song.tracks.length; i++) {
            if (song.tracks[i].n == n) {
                return song.tracks[i];
            }
        }
        const track = {
            n: n,
            notes: [],
            volume: 1,
            program: 0
        };
        song.tracks.push(track);
        return track;
    }
    takeBeat(n: number, song: Record<string, any>) {
        for (let i = 0; i < song.beats.length; i++) {
            if (song.beats[i].n == n) {
                return song.beats[i];
            }
        }
        const beat = {
            n: n,
            notes: [],
            volume: 1
        };
        song.beats.push(beat);
        return beat;
    }
    parseSong() {
        const song = {
            duration: 0,
            tracks: [],
            beats: []
        };
        const events = this.getMidiEvents();
        // console.debug(events);
        // To set the pitch-bend range, three to four consecutive EVENT_MIDI_CONTROLLER messages must have consistent contents.
        let expectedPitchBendRangeMessageNumber = 1; // counts which pitch-bend range message can be expected next: number 1 (can be sent any time, except after pitch-bend range messages number 1 or 2), number 2 (required after number 1), number 3 (required after number 2), or number 4 (optional)
        let expectedPitchBendRangeChannel = null;
        const pitchBendRange = Array(16).fill(2); // Default pitch-bend range is 2 semitones.
        for (let i = 0; i < events.length; i++) {
            const expectedPitchBendRangeMessageNumberOld = expectedPitchBendRangeMessageNumber;
            // console.debug('		next',events[i]);
            if (song.duration < events[i].playTime / 1000) {
                song.duration = events[i].playTime / 1000;
            }
            if (events[i].subtype == MIDIEvents.EVENT_MIDI_NOTE_ON) {
                if (events[i].channel == 9) {
                    if (events[i].param1 >= 35 && events[i].param1 <= 81) {
                        this.startDrum(events[i], song);
                    } else {
                        // console.debug('wrong drum', events[i]);
                    }
                } else {
                    if (events[i].param1 >= 0 && events[i].param1 <= 127) {
                        // console.debug('start', events[i].param1);
                        this.startNote(events[i], song);
                    } else {
                        // console.debug('wrong tone', events[i]);
                    }
                }
            } else {
                if (events[i].subtype == MIDIEvents.EVENT_MIDI_NOTE_OFF) {
                    if (events[i].channel != 9) {
                        this.closeNote(events[i], song);
                        // console.debug('close', events[i].param1);
                    }
                } else {
                    if (events[i].subtype == MIDIEvents.EVENT_MIDI_PROGRAM_CHANGE) {
                        if (events[i].channel != 9) {
                            const track = this.takeTrack(events[i].channel, song);
                            track.program = events[i].param1;
                        } else {
                            // console.debug('skip program for drums');
                        }
                    } else {
                        if (events[i].subtype == MIDIEvents.EVENT_MIDI_CONTROLLER) {
                            if (events[i].param1 == 7) {
                                if (events[i].channel != 9) { // TODO why not set loudness for drums?
                                    const track = this.takeTrack(events[i].channel, song);
                                    track.volume = events[i].param2 / 127 || 0.000001;
                                    // console.debug('volume', track.volume,'for',events[i].channel);
                                }
                            } else if (
                                (expectedPitchBendRangeMessageNumber == 1 && events[i].param1 == 0x65 && events[i].param2 == 0x00) ||
                                (expectedPitchBendRangeMessageNumber == 2 && events[i].param1 == 0x64 && events[i].param2 == 0x00) ||
                                (expectedPitchBendRangeMessageNumber == 3 && events[i].param1 == 0x06) ||
                                (expectedPitchBendRangeMessageNumber == 4 && events[i].param1 == 0x26)
                            ) {
                                if (expectedPitchBendRangeMessageNumber > 1 && events[i].channel != expectedPitchBendRangeChannel) {
                                    throw Error('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
                                }
                                expectedPitchBendRangeChannel = events[i].channel;
                                if (expectedPitchBendRangeMessageNumber == 3) {
                                    pitchBendRange[events[i].channel] = events[i].param2; // in semitones
                                    // console.debug('pitchBendRange', pitchBendRange);
                                }
                                if (expectedPitchBendRangeMessageNumber == 4) {
                                    pitchBendRange[events[i].channel] += events[i].param2 / 100; // convert cents to semitones, add to semitones set in the previous MIDI message
                                    // console.debug('pitchBendRange', pitchBendRange);
                                }
                                expectedPitchBendRangeMessageNumber++;
                                if (expectedPitchBendRangeMessageNumber == 5) {
                                    expectedPitchBendRangeMessageNumber = 1;
                                }
                            } else {
                                // console.debug('controller', events[i]);
                            }
                        } else {
                            if (events[i].subtype == MIDIEvents.EVENT_MIDI_PITCH_BEND) {
                                // console.debug('	bend', events[i].channel, events[i].param1, events[i].param2);
                                this.addSlide(events[i], song, pitchBendRange[events[i].channel]);
                            } else {
                                // console.debug('unknown', events[i].channel, events[i]);
                            };
                        }
                    }
                }
            }
            if (expectedPitchBendRangeMessageNumberOld == expectedPitchBendRangeMessageNumber) { // If the current message wasn't an expected pitch-bend range message
                if (expectedPitchBendRangeMessageNumberOld >= 2 && expectedPitchBendRangeMessageNumberOld <= 3) {
                    throw Error('Pitch-bend RANGE (SENSITIVITY) messages ended prematurely. MIDI file might be corrupt.');
                }
                if (expectedPitchBendRangeMessageNumberOld == 4) { // The fourth message is optional, so since it wasn't sent, the setting of the pitch-bend range is done, and we might expect the first pitch-bend range message some time in the future
                    expectedPitchBendRangeMessageNumber = 1;
                }
            }
        }
        return song;
    }
    // Events reading helpers
    getEvents(type: number, subtype?: number) {
        let playTime = 0;
        let filteredEvents = [];
        let format = this.header.getFormat();
        let tickResolution = this.header.getTickResolution();

        // Reading events
        // if the read is sequential
        if (1 !== format || 1 === this.tracks.length) {
            for (let i = 0, j = this.tracks.length; i < j; i++) {
                // reset playtime if format is 2
                playTime = (2 === format && playTime ? playTime : 0);
                const events = MIDIEvents.createParser(this.tracks[i].getTrackContent(), 0, false);
                // loooping through events
                let event = events.next();
                while (event) {
                    playTime += event.delta ? (event.delta * tickResolution) / 1000 : 0;
                    if (event.type === MIDIEvents.EVENT_META) {
                        // tempo change events
                        if (event.subtype === MIDIEvents.EVENT_META_SET_TEMPO) {
                            tickResolution = this.header.getTickResolution(event.tempo);
                        }
                    }
                    // push the asked events
                    if (((!type) || event.type === type) &&
                        ((!subtype) || (event.subtype && event.subtype === subtype))) {
                        event.playTime = playTime;
                        filteredEvents.push(event);
                    }
                    event = events.next();
                }
            }
            // the read is concurrent
        } else {
            const trackParsers: {
                curEvent: EventType | null;
                parser: {
                    next(): EventType | null;
                };
            }[] = [];
            let smallestDelta = -1;

            // Creating parsers
            for (let i = 0, j = this.tracks.length; i < j; i++) {
                const parser = MIDIEvents.createParser(
                    this.tracks[i].getTrackContent(), 0, false);
                trackParsers[i] = {
                    parser,
                    curEvent: parser.next()
                }
            }
            // Filling events
            do {
                smallestDelta = -1;
                // finding the smallest event
                for (let i = 0, j = trackParsers.length; i < j; i++) {
                    if (trackParsers[i].curEvent !== null) {
                        const curEvent = trackParsers[i].curEvent;
                        if (curEvent === undefined || curEvent === null) {
                            throw new Error('Unexpected undefined event');
                        }
                        if (-1 === smallestDelta) {
                            smallestDelta = i;
                        } else {
                            const smallestCurEvent = trackParsers[smallestDelta].curEvent;
                            if (smallestCurEvent === undefined || smallestCurEvent === null) {
                                throw new Error('Unexpected undefined event');
                            }
                            if (curEvent.delta <
                                smallestCurEvent.delta) {
                                smallestDelta = i;
                            }
                        }
                    }
                }
                if (-1 !== smallestDelta) {
                    // removing the delta of previous events
                    for (let i = 0, j = trackParsers.length; i < j; i++) {
                        const curEvent = trackParsers[i].curEvent;
                        if (i !== smallestDelta && curEvent !== null) {
                            const smallestCurEvent = trackParsers[smallestDelta].curEvent;
                            if (smallestCurEvent === undefined || smallestCurEvent === null) {
                                throw new Error('Unexpected undefined event');
                            }
                            curEvent.delta -= smallestCurEvent.delta;
                        }
                    }
                    // filling values
                    const event = trackParsers[smallestDelta].curEvent;
                    if (event === undefined || event === null) {
                        throw new Error('Unexpected undefined event');
                    }
                    playTime += (event.delta ? (event.delta * tickResolution) / 1000 : 0);
                    if (event.type === MIDIEvents.EVENT_META) {
                        // tempo change events
                        if (event.subtype === MIDIEvents.EVENT_META_SET_TEMPO) {
                            tickResolution = this.header.getTickResolution(event.tempo);
                        }
                    }
                    // push midi events
                    if (((!type) || event.type === type) &&
                        ((!subtype) || (event.subtype && event.subtype === subtype))) {
                        event.playTime = playTime;
                        event.track = smallestDelta;
                        filteredEvents.push(event);
                    }
                    // getting next event
                    trackParsers[smallestDelta].curEvent = trackParsers[smallestDelta].parser.next();
                }
            } while (-1 !== smallestDelta);
        }
        return filteredEvents;
    };

    getMidiEvents() {
        return this.getEvents(MIDIEvents.EVENT_MIDI);
    };

    // Basic events reading
    getTrackEvents(index: number) {
        const events = [];
        if (index > this.tracks.length || 0 > index) {
            throw Error('Invalid track index (' + index + ')');
        }
        const parser = MIDIEvents.createParser(
            this.tracks[index].getTrackContent(), 0, false);
        let event = parser.next();
        do {
            events.push(event);
            event = parser.next();
        } while (event);
        return events;
    };

    // Basic events writting
    setTrackEvents(index: number, events: EventType[]) {

        if (index > this.tracks.length || 0 > index) {
            throw Error('Invalid track index (' + index + ')');
        }
        if ((!events) || (!events.length)) {
            throw Error('A track must contain at least one event, none given.');
        }
        const bufferLength = MIDIEvents.getRequiredBufferLength(events);
        const destination = new Uint8Array(bufferLength);
        MIDIEvents.writeToTrack(events, destination);
        this.tracks[index].setTrackContent(destination);
    };

    // Remove a track
    deleteTrack(index: number) {
        if (index > this.tracks.length || 0 > index) {
            throw Error('Invalid track index (' + index + ')');
        }
        this.tracks.splice(index, 1);
        this.header.setTracksCount(this.tracks.length);
    };

    // Add a track
    addTrack(index: number) {

        if (index > this.tracks.length || 0 > index) {
            throw Error('Invalid track index (' + index + ')');
        }
        const track = new MIDIFileTrack();
        if (index === this.tracks.length) {
            this.tracks.push(track);
        } else {
            this.tracks.splice(index, 0, track);
        }
        this.header.setTracksCount(this.tracks.length);
    };

    // Retrieve the content in a buffer
    getContent() {

        // Calculating the buffer content
        // - initialize with the header length
        let bufferLength = MIDIFileHeader.HEADER_LENGTH;
        // - add tracks length
        for (let i = 0, j = this.tracks.length; i < j; i++) {
            bufferLength += this.tracks[i].getTrackLength() + 8;
        }
        // Creating the destination buffer
        const destination = new Uint8Array(bufferLength);
        // Adding header
        let origin = new Uint8Array(this.header.datas.buffer,
            this.header.datas.byteOffset,
            MIDIFileHeader.HEADER_LENGTH);
        let i = 0;
        for (let j = MIDIFileHeader.HEADER_LENGTH; i < j; i++) {
            destination[i] = origin[i];
        }
        // Adding tracks
        for (let k = 0, l = this.tracks.length; k < l; k++) {
            origin = new Uint8Array(this.tracks[k].datas.buffer,
                this.tracks[k].datas.byteOffset,
                this.tracks[k].datas.byteLength);
            for (let m = 0, n = this.tracks[k].datas.byteLength; m < n; m++) {
                destination[i++] = origin[m];
            }
        }
        return destination.buffer;
    };

    // Exports Track/Header constructors
    static Header = MIDIFileHeader;
    static Track = MIDIFileTrack;
}
