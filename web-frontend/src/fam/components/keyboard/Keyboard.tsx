import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardKey } from './KeyboardKey';
import { ChannelId } from '../../apu';
import { MidiDeviceSelector } from './MidiSelector';

type KeyboardProps = {
    channel: ChannelId,
    onPlayNote: (channel: ChannelId, midiNote: number) => void,
}

export const Keyboard = memo((props: KeyboardProps) => {
    const totalKeys = 97;
    const whiteKeys = 57;
    const notePattern = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const blackNoteIndices = [1, 3, 6, 8, 10];

    const whiteKeyWidthPercent = 100 / whiteKeys;

    const [devices, setDevices] = useState<MIDIInput[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [activeNotes, setActiveNotes] = useState<Map<number, number>>(new Map());

    // Stable container for changing prop callback
    const playNoteRef = useRef(props.onPlayNote);

    // Updates reference to the latest one
    useEffect(() => {
        playNoteRef.current = props.onPlayNote;
    });

    const handlePlayNote = useCallback((midiNote: number) => {
        setActiveNotes(prev => {
            const next = new Map(prev);
            const currentCount = next.get(midiNote) || 0;
            next.set(midiNote, currentCount + 1);
            return next;
        });

        playNoteRef.current(props.channel, midiNote);
    }, [props.channel]);

    const handleStopNote = useCallback((midiNote: number) => {
        setActiveNotes(prev => {
            if (!prev.has(midiNote)) return prev;

            const next = new Map(prev);
            const currentCount = next.get(midiNote)!;
            const newCount = currentCount - 1;

            if (newCount <= 0) {
                next.delete(midiNote);
            } else {
                next.set(midiNote, newCount);
            }
            return next;
        });
    }, []);

    const handleMidiMessage = useCallback((message: MIDIMessageEvent) => {
        if (!message.data) return;

        const [status, note, velocity] = message.data;

        const command = status & 0xF0;

        if (command === 0x90 && velocity > 0) {
            handlePlayNote(note);
        } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
            handleStopNote(note);
        }
    }, [handlePlayNote, handleStopNote]);

    useEffect(() => {
        const activeDevice = devices.find(d => d.id === selectedDeviceId);
        if (activeDevice) {
            console.log(`Setting up message handler for active device ${activeDevice.name}`);
            activeDevice.onmidimessage = handleMidiMessage;
        } else if (selectedDeviceId === '' && devices.length > 0) {
            // Automatically select first device if none selected
            setSelectedDeviceId(devices[0].id);
        }

        return () => {
            if (activeDevice) {
                activeDevice.onmidimessage = null;
            }
        }
    }, [selectedDeviceId, devices, handleMidiMessage]);

    useEffect(() => {
        let midiAccess: MIDIAccess | null = null;

        const updateDeviceList = (midi: MIDIAccess) => {
            setDevices(Array.from(midi.inputs.values()));
        }

        const initMidi = async () => {
            if (!navigator.requestMIDIAccess) {
                console.warn("Web MIDI API is not supported in this browser!");
                return;
            }

            try {
                midiAccess = await navigator.requestMIDIAccess();
                console.log("MIDI access granted!");

                updateDeviceList(midiAccess);
                midiAccess.onstatechange = (e) => {
                    if (e.port && e.port.type === 'input' && e.port.state === 'connected') {
                        console.log(`Connected MIDI device ${e.port.name}`);
                    }
                    updateDeviceList(midiAccess!);
                };
            } catch (e) {
                console.error("Failed to get MIDI access:", e);
            }
        }

        const initPromise = initMidi();

        return () => {
            // Same deal as with App
            initPromise.then(() => {
                if (midiAccess) {
                    midiAccess.onstatechange = null;
                    for (const input of midiAccess.inputs.values()) {
                        input.onmidimessage = null;
                    }
                }
            });
        };
    }, []);

    const keys = Array.from({ length: totalKeys }, (_, index) => {
        const patternIndex = index % 12;
        const octave = Math.floor(index / 12);
        const midiNote = index + 12;

        const noteName = `${notePattern[patternIndex]}${octave}`;
        const isBlack = blackNoteIndices.includes(patternIndex);
        const isExtra = index < 9; // Imperial Bösendorfer extra bass keys starting from C0

        return (
            <KeyboardKey 
                key={noteName}
                midiNote={midiNote}
                baseWidthPercent={whiteKeyWidthPercent}
                isBlack={isBlack}
                isExtra={isExtra}
                onPlayNote={handlePlayNote}
                onStopNote={handleStopNote}
                active={activeNotes.has(midiNote)}
            />
        )
    });

    return (
        <div>
            <MidiDeviceSelector 
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
                devices={devices}
            />
            <div className="@container flex touch-none">
                {keys}
            </div>
        </div>
    )
});

Keyboard.displayName = 'Keyboard';