import React, { useState } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';

type PulseStripProps = ChannelStripProps & {
    write: (offset: number, value: number) => void,
    isPulse1?: boolean
}

type PulseState = {
    volume: number,
    constantVolume: boolean,
    loop: boolean,
    dutyCycle: number,

    sweepShift: number,
    sweepNegate: boolean,
    sweepPeriod: number,
    sweepEnabled: boolean,

    timerPeriod: number,
    lengthCounterLoad: number
};

const initialState: PulseState = {
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
};

export const PulseStrip = (props: PulseStripProps) => {
    const [state, setState] = useState<PulseState>(initialState);

    const setVolume = (value: number) => {
        const regValue = (value & 0xF) | 
                         (state.constantVolume ? 0x10 : 0) |
                         (state.loop ? 0x20 : 0) |
                         ((state.dutyCycle & 3) << 6);
        props.write(0, regValue);
        setState(state => ({...state, volume: value}));
    }

    const setUseEnvelope = (value: boolean) => {
        const regValue = (state.volume & 0xF) | 
                         (value ? 0 : 0x10) |
                         (state.loop ? 0x20 : 0) |
                         ((state.dutyCycle & 3) << 6);
        props.write(0, regValue);
        setState(state => ({...state, constantVolume: !value}));
    }

    const setLooping = (value: boolean) => {
        const regValue = (state.volume & 0xF) | 
                         (state.constantVolume ? 0x10 : 0) |
                         (value ? 0x20 : 0) |
                         ((state.dutyCycle & 3) << 6);
        props.write(0, regValue);
        setState(state => ({...state, loop: value}));
    }

    const setDutyCycle = (value: number) => {
        const regValue = (state.volume & 0xF) | 
                         (state.constantVolume ? 0x10 : 0) |
                         (state.loop ? 0x20 : 0) |
                         ((value & 3) << 6);
        props.write(0, regValue);
        setState(state => ({...state, dutyCycle: value}));
    }

    const setSweepShift = (value: number) => {
        const regValue = (value & 7) |
                         (state.sweepNegate ? 8 : 0) |
                         ((state.sweepPeriod & 7) << 4) |
                         (state.sweepEnabled ? 0x80 : 0);
        props.write(1, regValue);
        setState(state => ({...state, sweepShift: value}));
    }

    const setNegateSweep = (value: boolean) => {
        const regValue = (state.sweepShift & 7) |
                         (value ? 8 : 0) |
                         ((state.sweepPeriod & 7) << 4) |
                         (state.sweepEnabled ? 0x80 : 0);
        props.write(1, regValue);
        setState(state => ({...state, sweepNegate: value}));
    }

    const setSweepPeriod = (value: number) => {
        const regValue = (state.sweepShift & 7) |
                         (state.sweepNegate ? 8 : 0) |
                         ((value & 7) << 4) |
                         (state.sweepEnabled ? 0x80 : 0);
        props.write(1, regValue);
        setState(state => ({...state, sweepPeriod: value}));
    }

    const setSweepEnabled = (value: boolean) => {
        const regValue = (state.sweepShift & 7) |
                         (state.sweepNegate ? 8 : 0) |
                         ((state.sweepPeriod & 7) << 4) |
                         (value ? 0x80 : 0);
        props.write(1, regValue);
        setState(state => ({...state, sweepEnabled: value}));
    }

    const setPeriod = (value: number) => {
        props.write(2, value & 0xFF);
        props.write(3, ((value >> 8) & 7) | ((state.lengthCounterLoad & 0x1F) << 3));
        setState(state => ({...state, timerPeriod: value}));
    }

    const setLengthCounterLoad = (value: number) => {
        props.write(3, ((state.timerPeriod >> 8) & 7) | ((value & 0x1F) << 3));
        setState(state => ({...state, lengthCounterLoad: value}));
    }

    const triggerNote = () => {
        props.write(2, state.timerPeriod & 0xFF);
        props.write(3, ((state.timerPeriod >> 8) & 7) | ((state.lengthCounterLoad & 0x1F) << 3));
    }

    return (
        <ChannelStrip 
            label={props.label} 
            enabled={props.enabled} 
            onSetEnabled={props.onSetEnabled}
        >
            <ChannelStripGroup label={props.isPulse1 ? '$4000' : '$4004'}>
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
                <div style={{ display: 'flex' }}>
                    <Slider
                        label={state.constantVolume ? 'Volume' : 'Envelope period'}
                        value={state.volume}
                        min={0}
                        max={0xF}
                        onChange={setVolume}
                        disabled={!props.enabled}
                    />
                    <Slider
                        label='Duty cycle'
                        value={state.dutyCycle}
                        min={0}
                        max={3}
                        onChange={setDutyCycle}
                        disabled={!props.enabled}
                    />
                </div>
            </ChannelStripGroup>
            <ChannelStripGroup label={props.isPulse1 ? '$4001' : '$4005'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
                    <Switch
                        label='Enable sweep' 
                        checked={state.sweepEnabled}
                        onChange={setSweepEnabled}
                        disabled={!props.enabled}
                    />
                    <Switch 
                        label='Negate sweep' 
                        checked={state.sweepNegate}
                        onChange={setNegateSweep}
                        disabled={!props.enabled}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <Slider
                        label='Sweep shift'
                        value={state.sweepShift}
                        min={0}
                        max={7}
                        onChange={setSweepShift}
                        disabled={!props.enabled}
                    />
                    <Slider
                        label='Sweep period'
                        value={state.sweepPeriod}
                        min={0}
                        max={7}
                        onChange={setSweepPeriod}
                        disabled={!props.enabled}
                    />
                </div>
            </ChannelStripGroup>
            <ChannelStripGroup label={props.isPulse1 ? '$4002 / $4003' : '$4006 / $4007'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center'  }}>
                    <div style={{ display: 'flex' }}>
                        <Slider
                            label='Period'
                            value={state.timerPeriod}
                            min={0}
                            max={0x7FF}
                            onChange={setPeriod}
                            disabled={!props.enabled}
                        />
                        <Slider
                            label='Length counter load'
                            value={state.lengthCounterLoad}
                            min={0}
                            max={0x1F}
                            onChange={setLengthCounterLoad}
                            disabled={!props.enabled}
                        />
                    </div>
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