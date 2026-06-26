import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';
import { TriangleChannel } from '../apu';

type TriangleStripProps = ChannelStripProps<TriangleChannel>;

export const TriangleStrip = memo((props: TriangleStripProps) => {

    const setLoop = useCallback((value: boolean) => {
        props.onChange({ loop: value });
    }, [props.onChange]);

    const setLinearCounterLoad = useCallback((value: number) => {
        props.onChange({ linearCounterLoad: value });
    }, [props.onChange]);

    const setTimerPeriod = useCallback((val: number) => {
        props.onChange({ timerPeriod: val });
    }, [props.onChange]);

    const setLengthCounterLoad = useCallback((val: number) => {
        props.onChange({ lengthCounterLoad: val });
    }, [props.onChange]);

    const handleTriggerNote = useCallback(() => {
        props.onChange({ lengthCounterLoad: props.state.lengthCounterLoad });
    }, [props.onChange, props.state.lengthCounterLoad]);

    return (
        <ChannelStrip<TriangleChannel>
            state={props.state}
            label={props.label}
            onChange={props.onChange}
            disabled={props.disabled}
        >
            <ChannelStripGroup label={'$4008'}>
                <Switch 
                    label='Loop' 
                    checked={props.state.loop}
                    onChange={setLoop}
                    disabled={props.disabled || !props.state.enabled}
                />
                <Slider
                    label='Linear counter load'
                    value={props.state.linearCounterLoad}
                    min={0}
                    max={0x7F}
                    onChange={setLinearCounterLoad}
                    disabled={props.disabled || !props.state.enabled}
                />
            </ChannelStripGroup>
            <ChannelStripGroup label={'$4009'} />
            <ChannelStripGroup label={'$400A / $400B'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center'  }}>
                    <div style={{ display: 'flex' }}>
                        <Slider
                            label='Period'
                            value={props.state.timerPeriod}
                            min={0}
                            max={0x7FF}
                            onChange={setTimerPeriod}
                            disabled={props.disabled || !props.state.enabled}
                        />
                        <Slider
                            label='Length counter load'
                            value={props.state.lengthCounterLoad}
                            min={0}
                            max={0x1F}
                            onChange={setLengthCounterLoad}
                            disabled={props.disabled || !props.state.enabled}
                        />
                    </div>
                    <div>
                        <button 
                            onClick={handleTriggerNote}
                            disabled={props.disabled || !props.state.enabled}
                        >
                            Trigger note
                        </button>
                    </div>
                </div>
            </ChannelStripGroup>
        </ChannelStrip>
    )
});