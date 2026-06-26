import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardKey } from './KeyboardKey';
import { ChannelId } from '../../apu';

type KeyboardProps = {
    channel: ChannelId,
    minNote?: number,
    maxNote?: number,
    onPlayNote: (midiNote: number) => void,
    onSetChannel: (channel: ChannelId) => void,
}

export const Keyboard = (props: KeyboardProps) => {
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

        playNoteRef.current(midiNote);
    }, []);

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
    }, [selectedDeviceId, devices]);

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
                    for (let input of midiAccess.inputs.values()) {
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
        const disabled = (props.minNote != null && props.minNote > midiNote) || (props.maxNote != null && props.maxNote < midiNote);

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
                disabled={disabled}
            />
        )
    });

    return (
        <div>
            <div style={{ margin: '8px', display: 'flex', gap: '24px' }} >
                <div style={{ display: 'flex', gap: '16px' }} >
                    <label>
                        Keyboard affects channel
                    </label>
                    <select
                        value={props.channel}
                        onChange={(e) => props.onSetChannel(e.target.value as ChannelId)}
                    >
                        <option value={'pulse1'}>Pulse 1</option>
                        <option value={'pulse2'}>Pulse 2</option>
                        <option value={'triangle'}>Triangle</option>
                        <option value={'noise'}>Noise</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '16px' }} >
                    <label>
                        Active device
                    </label>
                    <select
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                    >
                        <>
                        <option key='none' value='' >None</option>
                        {devices.map(input => (
                            <option key={input.id} value={input.id}>
                                {input.name}
                            </option>
                        ))}
                        </>
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', containerType: 'inline-size', touchAction: 'none', }}>
                {keys}
            </div>
        </div>
    )
}