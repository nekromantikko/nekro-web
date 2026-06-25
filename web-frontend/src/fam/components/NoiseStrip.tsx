import React, { useState } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';
import { NoiseChannel } from '../apu';

type NoiseStripProps = ChannelStripProps<NoiseChannel>;

export const NoiseStrip = (props: NoiseStripProps) => {
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
                        onChange={(val) => props.onChange({ constantVolume: !val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <Switch 
                        label='Loop' 
                        checked={props.state.loop}
                        onChange={(val) => props.onChange({ loop: val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                </div>
                <Slider
                    label={props.state.constantVolume ? 'Volume' : 'Envelope period'}
                    value={props.state.volume}
                    min={0}
                    max={0xF}
                    onChange={(val) => props.onChange({ volume: val })}
                    disabled={props.disabled || !props.state.enabled}
                />
            </ChannelStripGroup>
            <ChannelStripGroup label={'$400E'}>
                <Switch 
                    label='Mode' 
                    checked={props.state.mode}
                    onChange={(val) => props.onChange({ mode: val })}
                    disabled={props.disabled || !props.state.enabled}
                />
                <Slider
                    label='Period'
                    value={props.state.period}
                    min={0}
                    max={0xF}
                    onChange={(val) => props.onChange({ period: val })}
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
                        onChange={(val) => props.onChange({ lengthCounterLoad: val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <div>
                        <button 
                            onClick={() => props.onChange({ lengthCounterLoad: props.state.lengthCounterLoad })}
                            disabled={props.disabled || !props.state.enabled}
                        >
                            Trigger note
                        </button>
                    </div>
                </div>
            </ChannelStripGroup>
        </ChannelStrip>
    )
}