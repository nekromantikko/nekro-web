import React, { useState } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';
import { TriangleChannel } from '../apu';

type TriangleStripProps = ChannelStripProps<TriangleChannel>;

export const TriangleStrip = (props: TriangleStripProps) => {
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
                    onChange={(val) => props.onChange({ loop: val })}
                    disabled={props.disabled || !props.state.enabled}
                />
                <Slider
                    label='Linear counter load'
                    value={props.state.linearCounterLoad}
                    min={0}
                    max={0x7F}
                    onChange={(val) => props.onChange({ linearCounterLoad: val })}
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
                            onChange={(val) => props.onChange({ timerPeriod: val })}
                            disabled={props.disabled || !props.state.enabled}
                        />
                        <Slider
                            label='Length counter load'
                            value={props.state.lengthCounterLoad}
                            min={0}
                            max={0x1F}
                            onChange={(val) => props.onChange({ lengthCounterLoad: val })}
                            disabled={props.disabled || !props.state.enabled}
                        />
                    </div>
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