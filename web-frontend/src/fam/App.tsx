import React, { useEffect, useState } from 'react';
import { PulseStrip } from './components/PulseStrip';
import { TriangleStrip } from './components/TriangleStrip';
import { NoiseStrip } from './components/NoiseStrip';
import { ControlPanel } from './components/ControlPanel';

import processorUrl from './fam-audio-processor.ts?worker&url';

type AppState = {
    audioContext?: AudioContext;
    workletNode?: AudioWorkletNode;
};

type ChannelState = {
    enablePulse1: boolean,
    enablePulse2: boolean,
    enableTriangle: boolean,
    enableNoise: boolean,
};

const initialChannelState: ChannelState = {
    enablePulse1: false,
    enablePulse2: false,
    enableTriangle: false,
    enableNoise: false
};

const App = () => {
    const [state, setState] = useState<AppState>();
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [channelState, setChannelState] = useState<ChannelState>(initialChannelState);

    const writeRegister = (address: number, value: number) => {
        console.log(`Writing 0x${value.toString(16)} to address $${address.toString(16)}`);
        state?.workletNode?.port.postMessage({
            type: 'REG_WRITE',
            address: address,
            value: value
        });
    }

    const setPulse1Enabled = (value: boolean) => {
        const regValue = (value ? 0x1 : 0) |
                         (channelState.enablePulse2 ? 0x2 : 0) |
                         (channelState.enableTriangle ? 0x4 : 0) |
                         (channelState.enableNoise ? 0x8 : 0);
        writeRegister(0x4015, regValue);
        setChannelState(state => ({...state, enablePulse1: value}));
    }

    const setPulse2Enabled = (value: boolean) => {
        const regValue = (channelState.enablePulse1 ? 0x1 : 0) |
                         (value ? 0x2 : 0) |
                         (channelState.enableTriangle ? 0x4 : 0) |
                         (channelState.enableNoise ? 0x8 : 0);
        writeRegister(0x4015, regValue);
        setChannelState(state => ({...state, enablePulse2: value}));
    }

    const setTriangleEnabled = (value: boolean) => {
        const regValue = (channelState.enablePulse1 ? 0x1 : 0) |
                         (channelState.enablePulse2 ? 0x2 : 0) |
                         (value ? 0x4 : 0) |
                         (channelState.enableNoise ? 0x8 : 0);
        writeRegister(0x4015, regValue);
        setChannelState(state => ({...state, enableTriangle: value}));
    }

    const setNoiseEnabled = (value: boolean) => {
        const regValue = (channelState.enablePulse1 ? 0x1 : 0) |
                         (channelState.enablePulse2 ? 0x2 : 0) |
                         (channelState.enableTriangle ? 0x4 : 0) |
                         (value ? 0x8 : 0);
        writeRegister(0x4015, regValue);
        setChannelState(state => ({...state, enableNoise: value}));
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
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'stretch'}}>
                <PulseStrip 
                    label='Pulse 1'
                    isPulse1
                    enabled={channelState.enablePulse1} 
                    onSetEnabled={setPulse1Enabled}
                    write={(offset, value) => writeRegister(0x4000 + offset, value)}
                />
                <PulseStrip 
                    label='Pulse 2'
                    enabled={channelState.enablePulse2} 
                    onSetEnabled={setPulse2Enabled}
                    write={(offset, value) => writeRegister(0x4004 + offset, value)}
                />
                <TriangleStrip 
                    label='Triangle'
                    enabled={channelState.enableTriangle}
                    onSetEnabled={setTriangleEnabled}
                    write={(offset, value) => writeRegister(0x4008 + offset, value)}
                />
                <NoiseStrip 
                    label='Noise'
                    enabled={channelState.enableNoise}
                    onSetEnabled={setNoiseEnabled}
                    write={(offset, value) => writeRegister(0x400C + offset, value)}
                />
            </div>
            
        </div>
    );
}

export default App;