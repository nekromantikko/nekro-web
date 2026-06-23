import React, { useEffect, useState } from 'react';

type AppState = {
    audioContext?: AudioContext;
    workletNode?: AudioWorkletNode;
};

const App = () => {
    const [state, setState] = useState<AppState>();
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [duty, setDuty] = useState<number>(2);
    const [volume, setVolume] = useState<number>(8);

    const writeRegister = (address: number, value: number) => {
        console.log(`Writing ${value.toString(16)} to adress ${address.toString(16)}`);
        state?.workletNode?.port.postMessage({
            type: 'REG_WRITE',
            address: address,
            value: value
        });
    }

    const changeDuty = (value: number) => {
        setDuty(value);

        const regValue = 0x30 | ((value & 3) << 6) | volume & 15;
        writeRegister(0x4000, regValue);
    }

    const changeVolume = (value: number) => {
        setVolume(value);

        const regValue = 0x30 | ((duty & 3) << 6) | value & 15;
        writeRegister(0x4000, regValue);
    }

    const isAudioContextRunning = (ctx: AudioContext): boolean => {
        return ctx.state === 'running' || ctx.state === 'interrupted';
    }

    const toggleRunning = async () => {
        if (!state || !state.audioContext) return;

        if (isAudioContextRunning(state.audioContext)) {
            await state.audioContext.suspend();
        } else await state.audioContext.resume();

        setIsRunning(isAudioContextRunning(state.audioContext));
    }

    useEffect(() => {
        let audioContext: AudioContext | null = null;

        const initializeState = async () => {
            console.log("Initializing state...");
            audioContext = new AudioContext();

            const processorUrl = new URL('./fam-audio-processor.ts', import.meta.url).href;
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
        <div>
            <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
                <h2>Synthesizer Sandbox Layer</h2>
                <button id="start-audio-btn" style={{padding: "10px 20px", fontSize: "16px", cursor: "pointer"}} onClick={toggleRunning}>
                    {isRunning ? "Pause" : "Play"}
                </button>
            </div>
            <div>
                <h3>Pulse 1 Controls</h3>
        
                <label>Volume: </label>
                <input type="range" id="pulse1-vol" min="0" max="15" value={volume} onChange={(e) => changeVolume(e.target.valueAsNumber)}/>

                <label>Duty Cycle: </label>
                <button onClick={() => changeDuty(0)}>12.5%</button>
                <button onClick={() => changeDuty(1)}>25%</button>
                <button onClick={() => changeDuty(2)}>50%</button>
                <button onClick={() => changeDuty(3)}>25% Negated</button>
            </div>
        </div>
    );
}

export default App;