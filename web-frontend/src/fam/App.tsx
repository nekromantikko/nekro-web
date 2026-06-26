import React, { useEffect, useState } from 'react';
import { PulseStrip } from './components/PulseStrip';
import { TriangleStrip } from './components/TriangleStrip';
import { NoiseStrip } from './components/NoiseStrip';
import { ControlPanel } from './components/ControlPanel';

import processorUrl from './fam-audio-processor.ts?worker&url';
import { Keyboard } from './components/keyboard/Keyboard';
import { ApuState, ChannelId, NoiseChannel, PulseChannel, TriangleChannel } from './apu';

type AppState = {
    audioContext?: AudioContext;
    workletNode?: AudioWorkletNode;
};

const initialApuState: ApuState = {
    pulse1: {
        enabled: false,

        volume: 0,
        constantVolume: false,
        loop: false,
        dutyCycle: 0,

        sweepShift: 0,
        sweepNegate: false,
        sweepPeriod: 0,
        sweepEnabled: false,

        timerPeriod: 0,
        lengthCounterLoad: 0
    },
    pulse2: {
        enabled: false,

        volume: 0,
        constantVolume: false,
        loop: false,
        dutyCycle: 0,

        sweepShift: 0,
        sweepNegate: false,
        sweepPeriod: 0,
        sweepEnabled: false,

        timerPeriod: 0,
        lengthCounterLoad: 0
    },
    triangle: {
        enabled: false,

        linearCounterLoad: 0,
        loop: false,

        timerPeriod: 0,
        lengthCounterLoad: 0,
    },
    noise: {
        enabled: false,

        volume: 0,
        constantVolume: false,
        loop: false,

        period: 0,
        mode: false,

        lengthCounterLoad: 0
    }
}

const App = () => {
    const [state, setState] = useState<AppState>();
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [apuState, setApuState] = useState<ApuState>(initialApuState);
    const [kbChannel, setKbChannel] = useState<ChannelId>('pulse1');

    const nesCpuFreqNtsc = 1789773;

    const writeRegister = (address: number, value: number) => {
        // console.log(`Writing 0x${value.toString(16)} to address $${address.toString(16)}`);
        state?.workletNode?.port.postMessage({
            type: 'REG_WRITE',
            address: address,
            value: value
        });
    }

    const getStatusRegisterValue = (apu: ApuState): number => {
        return (apu.pulse1.enabled ? 0x1 : 0) |
               (apu.pulse2.enabled ? 0x2 : 0) |
               (apu.triangle.enabled ? 0x4 : 0) |
               (apu.noise.enabled ? 0x8 : 0);
    }

    const getPulseRegisterValue = (chan: PulseChannel, offset: number): number => {
        switch(offset) {
            case 0: {
                return (chan.volume & 0xF) | 
                       (chan.constantVolume ? 0x10 : 0) |
                       (chan.loop ? 0x20 : 0) |
                       ((chan.dutyCycle & 3) << 6);
            }
            case 1: {
                return (chan.sweepShift & 7) |
                       (chan.sweepNegate ? 8 : 0) |
                       ((chan.sweepPeriod & 7) << 4) |
                       (chan.sweepEnabled ? 0x80 : 0);
            }
            case 2: {
                return chan.timerPeriod & 0xFF;
            }
            case 3: {
                return ((chan.timerPeriod >> 8) & 7) |
                       ((chan.lengthCounterLoad & 0x1F) << 3);
            }
            default: {
                return NaN;
            }
        }
    }

    const getTriangleRegisterValue = (chan: TriangleChannel, offset: number): number => {
        switch(offset) {
            case 0: {
                return (chan.linearCounterLoad & 0x7F) |
                       (chan.loop ? 0x80 : 0);
            }
            case 1: {
                return 0;
            }
            case 2: {
                return chan.timerPeriod & 0xFF;
            }
            case 3: {
                return ((chan.timerPeriod >> 8) & 7) |
                       ((chan.lengthCounterLoad & 0x1F) << 3);
            }
            default: {
                return NaN;
            }
        }
    }

    const getNoiseRegisterValue = (chan: NoiseChannel, offset: number): number => {
        switch(offset) {
            case 0: {
                return (chan.volume & 0xF) | 
                       (chan.constantVolume ? 0x10 : 0) |
                       (chan.loop ? 0x20 : 0);
            }
            case 1: {
                return 0;
            }
            case 2: {
                return (chan.period & 0xF) |
                       (chan.mode ? 0x80 : 0);
            }
            case 3: {
                return ((chan.lengthCounterLoad & 0x1F) << 3);
            }
            default: {
                return NaN;
            }
        }
    }

    const updatePulse = (channel: 'pulse1' | 'pulse2', payload: Partial<PulseChannel>) => {
        const baseAddress = channel === 'pulse1' ? 0x4000 : 0x4004;

        setApuState(state => {
            const newState = {
                ...state,
                [channel]: {
                    ...state[channel],
                    ...payload
                }
            };

            if ('enabled' in payload) {
                writeRegister(0x4015, getStatusRegisterValue(newState));
            }

            if ('volume' in payload || 'constantVolume' in payload || 'loop' in payload || 'dutyCycle' in payload) {
                writeRegister(baseAddress, getPulseRegisterValue(newState[channel], 0));
            }

            if ('sweepShift' in payload || 'sweepNegate' in payload || 'sweepPeriod' in payload || 'sweepEnabled' in payload) {
                writeRegister(baseAddress + 1, getPulseRegisterValue(newState[channel], 1));
            }

            if ('lengthCounterLoad' in payload && !('timerPeriod' in payload)) {
                writeRegister(baseAddress + 3, getPulseRegisterValue(newState[channel], 3));
            } else if ('timerPeriod' in payload) {
                writeRegister(baseAddress + 2, getPulseRegisterValue(newState[channel], 2));
                writeRegister(baseAddress + 3, getPulseRegisterValue(newState[channel], 3));
            }

            return newState;
        });
    }

    const updateTriangle = (payload: Partial<TriangleChannel>) => {
        setApuState(state => {
            const newState = {
                ...state,
                triangle: {
                    ...state.triangle,
                    ...payload
                }
            };

            if ('enabled' in payload) {
                writeRegister(0x4015, getStatusRegisterValue(newState));
            }

            if ('linearCounterLoad' in payload || 'loop' in payload) {
                writeRegister(0x4008, getTriangleRegisterValue(newState.triangle, 0));
            }

            if ('lengthCounterLoad' in payload && !('timerPeriod' in payload)) {
                writeRegister(0x400B, getTriangleRegisterValue(newState.triangle, 3));
            } else if ('timerPeriod' in payload) {
                writeRegister(0x400A, getTriangleRegisterValue(newState.triangle, 2));
                writeRegister(0x400B, getTriangleRegisterValue(newState.triangle, 3));
            }

            return newState;
        });
    }

    const updateNoise = (payload: Partial<NoiseChannel>) => {
        setApuState(state => {
            const newState = {
                ...state,
                noise: {
                    ...state.noise,
                    ...payload
                }
            };

            if ('enabled' in payload) {
                writeRegister(0x4015, getStatusRegisterValue(newState));
            }

            if ('volume' in payload || 'constantVolume' in payload || 'loop' in payload) {
                writeRegister(0x400C, getNoiseRegisterValue(newState.noise, 0));
            }

            if ('period' in payload || 'mode' in payload) {
                writeRegister(0x400E, getNoiseRegisterValue(newState.noise, 2));
            }

            if ('lengthCounterLoad' in payload) {
                writeRegister(0x400F, getNoiseRegisterValue(newState.noise, 3));
            }

            return newState;
        });
    }

    const isAudioContextRunning = (ctx: AudioContext): boolean => {
        return ctx.state === 'running' || ctx.state === 'interrupted';
    }

    const toggleRunning = async (value: boolean) => {
        if (!state || !state.audioContext) return;

        const running = isAudioContextRunning(state.audioContext);

        if (value && !running) {
            await state.audioContext.resume();
        }
        else if (!value && running) {
            await state.audioContext.suspend();
        }

        setIsRunning(isAudioContextRunning(state.audioContext));
    }

    const midiNoteToNesPeriod = (midiNote: number, cpuFreq: number) => {
        // MIDI 69 = A4 (440Hz)
        const freq = 440 * Math.pow(2, (midiNote - 69) / 12);

        const period = Math.round(cpuFreq / (16 * freq)) - 1;

        return Math.max(0, Math.min(0x7FF, period));
    }

    const getMinNote = () => {
        if (kbChannel === 'noise') {
            return 24;
        }

        if (kbChannel === 'pulse1' || kbChannel === 'pulse2') {
            return apuState[kbChannel].sweepNegate ? 33 : 45;
        }

        return 33;
    }

    const getMaxNote = () => {
        if (!isRunning || !apuState[kbChannel].enabled) {
            return 0;
        }

        if (kbChannel === 'noise') {
            return 39;
        }

        return 108;
    }

    const handlePlayNote = (midiNote: number) => {
        const period = midiNoteToNesPeriod(midiNote, nesCpuFreqNtsc);

        if (kbChannel === 'pulse1' || kbChannel === 'pulse2') {
            updatePulse(kbChannel, { timerPeriod: period });
        }
        if (kbChannel === 'triangle') {
            updateTriangle({ timerPeriod: period });
        }
        if (kbChannel === 'noise') {
            updateNoise({ period: (midiNote - 24), lengthCounterLoad: apuState.noise.lengthCounterLoad });
        }
    }

    useEffect(() => {
        let audioContext: AudioContext | null = null;

        const initializeState = async () => {
            console.log("Initializing state...");
            audioContext = new AudioContext();

            await audioContext.audioWorklet.addModule(processorUrl);

            const workletNode = new AudioWorkletNode(audioContext, 'fam-audio-processor', {
                outputChannelCount: [2]
            });

            workletNode.connect(audioContext.destination);

            setState({
                audioContext,
                workletNode
            });
            setIsRunning(isAudioContextRunning(audioContext));
        }

        const initPromise = initializeState();

        initPromise.catch(e => 
            console.error("State initialization failed with error", e)
        );

        return () => {
            // Make sure initialization is done before deinitializing
            initPromise.then(() => {
                if (audioContext) {
                    audioContext.close();
                }
            });
        };
    }, []);

    return (
        <div style={{ minWidth: 'fit-content' }}>
            <ControlPanel 
                enabled={isRunning}
                onSetEnabled={toggleRunning}
            />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'stretch' }}>
                <PulseStrip 
                    label='Pulse 1'
                    isPulse1
                    state={apuState.pulse1}
                    onChange={(payload) => updatePulse('pulse1', payload)}
                    disabled={!isRunning}
                />
                <PulseStrip 
                    label='Pulse 2'
                    state={apuState.pulse2}
                    onChange={(payload) => updatePulse('pulse2', payload)}
                    disabled={!isRunning}
                />
                <TriangleStrip 
                    label='Triangle'
                    state={apuState.triangle}
                    onChange={(payload) => updateTriangle(payload)}
                    disabled={!isRunning}
                />
                <NoiseStrip 
                    label='Noise'
                    state={apuState.noise}
                    onChange={(payload) => updateNoise(payload)}
                    disabled={!isRunning}
                />
            </div>
            <div style={{ marginTop: '24px', }} >
                <Keyboard 
                    channel={kbChannel} 
                    onSetChannel={setKbChannel}
                    onPlayNote={handlePlayNote}
                    minNote={getMinNote()} 
                    maxNote={getMaxNote()}
                />
            </div>
            <p style={{ textAlign: 'end', color: '#999', margin: '8px' }}>
                Powered by <a style={{ color: 'bisque' }} href='https://github.com/nekromantikko/fam'>fam</a>
            </p>
        </div>
    );
}

export default App;