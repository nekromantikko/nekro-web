import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';
import { NoiseChannel } from '../apu';

type NoiseStripProps = ChannelStripProps<NoiseChannel>;

export const NoiseStrip = memo((props: NoiseStripProps) => {

    const { label, onChange, state, disabled } = props;

    const setUseEnvelope = useCallback((value: boolean) => {
        onChange({ constantVolume: !value });
    }, [onChange]);

    const setLoop = useCallback((value: boolean) => {
        onChange({ loop: value });
    }, [onChange]);

    const setVolume = useCallback((value: number) => {
        onChange({ volume: value });
    }, [onChange]);

    const setMode = useCallback((value: boolean) => {
        onChange({ mode: value })
    }, [onChange]);

    const setPeriod = useCallback((value: number) => {
        onChange({ period: value })
    }, [onChange]);

    const setLengthCounterLoad = useCallback((val: number) => {
        onChange({ lengthCounterLoad: val });
    }, [onChange]);

    const handleTriggerNote = useCallback(() => {
        onChange({ lengthCounterLoad: state.lengthCounterLoad });
    }, [onChange, state.lengthCounterLoad]);

    return (
        <ChannelStrip<NoiseChannel>
            state={state}
            label={label}
            onChange={onChange}
            disabled={disabled}
        >
            <ChannelStripGroup label={'$400C'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
                    <Switch
                        label='Use envelope' 
                        checked={!state.constantVolume}
                        onChange={setUseEnvelope}
                        disabled={disabled || !state.enabled}
                    />
                    <Switch 
                        label='Loop' 
                        checked={state.loop}
                        onChange={setLoop}
                        disabled={disabled || !state.enabled}
                    />
                </div>
                <Slider
                    label={state.constantVolume ? 'Volume' : 'Envelope period'}
                    value={state.volume}
                    min={0}
                    max={0xF}
                    onChange={setVolume}
                    disabled={disabled || !state.enabled}
                />
            </ChannelStripGroup>
            <ChannelStripGroup label={'$400E'}>
                <Switch 
                    label='Mode' 
                    checked={state.mode}
                    onChange={setMode}
                    disabled={disabled || !state.enabled}
                />
                <Slider
                    label='Period'
                    value={state.period}
                    min={0}
                    max={0xF}
                    onChange={setPeriod}
                    disabled={disabled || !state.enabled}
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
                        disabled={disabled || !state.enabled}
                    />
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

NoiseStrip.displayName = 'NoiseStrip';