import React, { useState } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';

type NoiseStripProps = ChannelStripProps & {
    write: (offset: number, value: number) => void
}

type NoiseState = {
    volume: number,
    constantVolume: boolean,
    loop: boolean,

    period: number,
    mode: boolean,

    lengthCounterLoad: number
};

const initialState: NoiseState = {
    volume: 0,
    constantVolume: false,
    loop: false,

    period: 0,
    mode: false,

    lengthCounterLoad: 0
};

export const NoiseStrip = (props: NoiseStripProps) => {
    const [state, setState] = useState<NoiseState>(initialState);

    const setVolume = (value: number) => {
        const regValue = (value & 0xF) | 
                         (state.constantVolume ? 0x10 : 0) |
                         (state.loop ? 0x20 : 0);
        props.write(0, regValue);
        setState(state => ({...state, volume: value}));
    }

    const setUseEnvelope = (value: boolean) => {
        const regValue = (state.volume & 0xF) | 
                         (value ? 0 : 0x10) |
                         (state.loop ? 0x20 : 0);
        props.write(0, regValue);
        setState(state => ({...state, constantVolume: !value}));
    }

    const setLooping = (value: boolean) => {
        const regValue = (state.volume & 0xF) | 
                         (state.constantVolume ? 0x10 : 0) |
                         (value ? 0x20 : 0);
        props.write(0, regValue);
        setState(state => ({...state, loop: value}));
    }

    const setPeriod = (value: number) => {
        const regValue = (value & 0xF) |
                         (state.mode ? 0x80 : 0);
        props.write(2, regValue);
        setState(state => ({...state, period: value}));
    }

    const setMode = (value: boolean) => {
        const regValue = (state.period & 0xF) |
                         (value ? 0x80 : 0);
        props.write(2, regValue);
        setState(state => ({...state, mode: value}));
    }

    const setLengthCounterLoad = (value: number) => {
        props.write(3, (value & 0x1F) << 3);
        setState(state => ({...state, lengthCounterLoad: value}));
    }

    const triggerNote = () => {
        props.write(3, (state.lengthCounterLoad & 0x1F) << 3);
    }
    
    return (
        <ChannelStrip
            label={props.label}
            enabled={props.enabled}
            onSetEnabled={props.onSetEnabled}
        >
            <ChannelStripGroup label={'$400C'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
                    <Switch
                        label='Use envelope' 
                        checked={!state.constantVolume}
                        onChange={setUseEnvelope}
                        disabled={!props.enabled}
                    />
                    <Switch 
                        label='Loop' 
                        checked={state.loop}
                        onChange={setLooping}
                        disabled={!props.enabled}
                    />
                </div>
                <Slider
                    label={state.constantVolume ? 'Volume' : 'Envelope period'}
                    value={state.volume}
                    min={0}
                    max={0xF}
                    onChange={setVolume}
                    disabled={!props.enabled}
                />
            </ChannelStripGroup>
            <ChannelStripGroup label={'$400E'}>
                <Switch 
                    label='Mode' 
                    checked={state.mode}
                    onChange={setMode}
                    disabled={!props.enabled}
                />
                <Slider
                    label='Period'
                    value={state.period}
                    min={0}
                    max={0xF}
                    onChange={setPeriod}
                    disabled={!props.enabled}
                />
            </ChannelStripGroup>
            <ChannelStripGroup label={'$400F'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center'  }}>
                    <Slider
                        label='Length counter load'
                        value={state.lengthCounterLoad}
                        min={0}
                        max={0x1F}
                        onChange={setLengthCounterLoad}
                        disabled={!props.enabled}
                    />
                    <div>
                        <button 
                            onClick={triggerNote}
                            disabled={!props.enabled}
                        >
                            Trigger note
                        </button>
                    </div>
                </div>
            </ChannelStripGroup>
        </ChannelStrip>
    )
}