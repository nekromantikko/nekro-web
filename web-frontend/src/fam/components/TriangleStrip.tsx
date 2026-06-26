import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';
import { TriangleChannel } from '../apu';

type TriangleStripProps = ChannelStripProps<TriangleChannel>;

export const TriangleStrip = memo((props: TriangleStripProps) => {

    const { label, onChange, state, disabled } = props;

    const setLoop = useCallback((value: boolean) => {
        onChange({ loop: value });
    }, [onChange]);

    const setLinearCounterLoad = useCallback((value: number) => {
        onChange({ linearCounterLoad: value });
    }, [onChange]);

    const setTimerPeriod = useCallback((val: number) => {
        onChange({ timerPeriod: val });
    }, [onChange]);

    const setLengthCounterLoad = useCallback((val: number) => {
        onChange({ lengthCounterLoad: val });
    }, [onChange]);

    const handleTriggerNote = useCallback(() => {
        onChange({ lengthCounterLoad: state.lengthCounterLoad });
    }, [onChange, state.lengthCounterLoad]);

    return (
        <ChannelStrip<TriangleChannel>
            state={state}
            label={label}
            onChange={onChange}
            disabled={disabled}
        >
            <ChannelStripGroup label={'$4008'}>
                <Switch 
                    label='Loop' 
                    checked={state.loop}
                    onChange={setLoop}
                    disabled={disabled || !state.enabled}
                />
                <Slider
                    label='Linear counter load'
                    value={state.linearCounterLoad}
                    min={0}
                    max={0x7F}
                    onChange={setLinearCounterLoad}
                    disabled={disabled || !state.enabled}
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
                            max={0x7FF}
                            onChange={setTimerPeriod}
                            disabled={disabled || !state.enabled}
                        />
                        <Slider
                            label='Length counter load'
                            value={state.lengthCounterLoad}
                            min={0}
                            max={0x1F}
                            onChange={setLengthCounterLoad}
                            disabled={disabled || !state.enabled}
                        />
                    </div>
                    <div>
                        <button 
                            onClick={handleTriggerNote}
                            disabled={disabled || !state.enabled}
                        >
                            Trigger note
                        </button>
                    </div>
                </div>
            </ChannelStripGroup>
        </ChannelStrip>
    )
});

TriangleStrip.displayName = 'TriangleStrip';