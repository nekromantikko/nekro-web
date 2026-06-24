import React, { useState } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';

type TriangleStripProps = ChannelStripProps & {
    write: (offset: number, value: number) => void
}

type TriangleState = {
    linearCounterLoad: number,
    loop: boolean,

    timerPeriod: number,
    lengthCounterLoad: number
};

const initialState: TriangleState = {
    linearCounterLoad: 0,
    loop: false,

    timerPeriod: 0,
    lengthCounterLoad: 0,
};

export const TriangleStrip = (props: TriangleStripProps) => {
    const [state, setState] = useState<TriangleState>(initialState);

    const setLooping = (value: boolean) => {
        const regValue = (state.linearCounterLoad & 0x7F) |
                         (value ? 0x80 : 0);
        props.write(0, regValue);
        setState(state => ({...state, loop: value}))
    }

    const setLinearCounterLoad = (value: number) => {
        const regValue = (value & 0x7F) |
                         (state.loop ? 0x80 : 0);
        props.write(0, regValue);
        setState(state => ({...state, linearCounterLoad: value}));
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
            <ChannelStripGroup label={'$4008'}>
                <Switch 
                    label='Loop' 
                    checked={state.loop}
                    onChange={setLooping}
                    disabled={!props.enabled}
                />
                <Slider
                    label='Linear counter load'
                    value={state.linearCounterLoad}
                    min={0}
                    max={0x7F}
                    onChange={setLinearCounterLoad}
                    disabled={!props.enabled}
                />
            </ChannelStripGroup>
            <ChannelStripGroup label={'$4009'} />
            <ChannelStripGroup label={'$400A / $400B'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center'  }}>
                    <div style={{ display: 'flex' }}>
                        <Slider
                            label='Period'
                            value={state.timerPeriod}
                            min={0}
                            max={2047}
                            onChange={setPeriod}
                            disabled={!props.enabled}
                        />
                        <Slider
                            label='Length counter load'
                            value={state.lengthCounterLoad}
                            min={0}
                            max={31}
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