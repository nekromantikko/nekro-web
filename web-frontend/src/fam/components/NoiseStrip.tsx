import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';
import { NoiseChannel } from '../apu';

type NoiseStripProps = ChannelStripProps<NoiseChannel>;

export const NoiseStrip = memo((props: NoiseStripProps) => {

    const setUseEnvelope = useCallback((value: boolean) => {
        props.onChange({ constantVolume: !value });
    }, [props.onChange]);

    const setLoop = useCallback((value: boolean) => {
        props.onChange({ loop: value });
    }, [props.onChange]);

    const setVolume = useCallback((value: number) => {
        props.onChange({ volume: value });
    }, [props.onChange]);

    const setMode = useCallback((value: boolean) => {
        props.onChange({ mode: value })
    }, [props.onChange]);

    const setPeriod = useCallback((value: number) => {
        props.onChange({ period: value })
    }, [props.onChange]);

    const setLengthCounterLoad = useCallback((val: number) => {
        props.onChange({ lengthCounterLoad: val });
    }, [props.onChange]);

    const handleTriggerNote = useCallback(() => {
        props.onChange({ lengthCounterLoad: props.state.lengthCounterLoad });
    }, [props.onChange, props.state.lengthCounterLoad]);

    return (
        <ChannelStrip<NoiseChannel>
            state={props.state}
            label={props.label}
            onChange={props.onChange}
            disabled={props.disabled}
        >
            <ChannelStripGroup label={'$400C'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
                    <Switch
                        label='Use envelope' 
                        checked={!props.state.constantVolume}
                        onChange={setUseEnvelope}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <Switch 
                        label='Loop' 
                        checked={props.state.loop}
                        onChange={setLoop}
                        disabled={props.disabled || !props.state.enabled}
                    />
                </div>
                <Slider
                    label={props.state.constantVolume ? 'Volume' : 'Envelope period'}
                    value={props.state.volume}
                    min={0}
                    max={0xF}
                    onChange={setVolume}
                    disabled={props.disabled || !props.state.enabled}
                />
            </ChannelStripGroup>
            <ChannelStripGroup label={'$400E'}>
                <Switch 
                    label='Mode' 
                    checked={props.state.mode}
                    onChange={setMode}
                    disabled={props.disabled || !props.state.enabled}
                />
                <Slider
                    label='Period'
                    value={props.state.period}
                    min={0}
                    max={0xF}
                    onChange={setPeriod}
                    disabled={props.disabled || !props.state.enabled}
                />
            </ChannelStripGroup>
            <ChannelStripGroup label={'$400F'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center'  }}>
                    <Slider
                        label='Length counter load'
                        value={props.state.lengthCounterLoad}
                        min={0}
                        max={0x1F}
                        onChange={setLengthCounterLoad}
                        disabled={props.disabled || !props.state.enabled}
                    />
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