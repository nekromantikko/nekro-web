import React, { useState } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';
import { PulseChannel } from '../apu';

type PulseStripProps = ChannelStripProps<PulseChannel> & {
    isPulse1?: boolean
}

export const PulseStrip = (props: PulseStripProps) => {
    return (
        <ChannelStrip<PulseChannel> 
            state={props.state}
            label={props.label} 
            onChange={props.onChange}
            disabled={props.disabled}
        >
            <ChannelStripGroup label={props.isPulse1 ? '$4000' : '$4004'}>
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
                <div style={{ display: 'flex' }}>
                    <Slider
                        label={props.state.constantVolume ? 'Volume' : 'Envelope period'}
                        value={props.state.volume}
                        min={0}
                        max={0xF}
                        onChange={(val) => props.onChange({ volume: val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <Slider
                        label='Duty cycle'
                        value={props.state.dutyCycle}
                        min={0}
                        max={3}
                        onChange={(val) => props.onChange({ dutyCycle: val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                </div>
            </ChannelStripGroup>
            <ChannelStripGroup label={props.isPulse1 ? '$4001' : '$4005'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
                    <Switch
                        label='Enable sweep' 
                        checked={props.state.sweepEnabled}
                        onChange={(val) => props.onChange({ sweepEnabled: val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <Switch 
                        label='Negate sweep' 
                        checked={props.state.sweepNegate}
                        onChange={(val) => props.onChange({ sweepNegate: val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <Slider
                        label='Sweep shift'
                        value={props.state.sweepShift}
                        min={0}
                        max={7}
                        onChange={(val) => props.onChange({ sweepShift: val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <Slider
                        label='Sweep period'
                        value={props.state.sweepPeriod}
                        min={0}
                        max={7}
                        onChange={(val) => props.onChange({ sweepPeriod: val })}
                        disabled={props.disabled || !props.state.enabled}
                    />
                </div>
            </ChannelStripGroup>
            <ChannelStripGroup label={props.isPulse1 ? '$4002 / $4003' : '$4006 / $4007'}>
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