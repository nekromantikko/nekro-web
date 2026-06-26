import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ChannelStripGroup } from './ChannelStripGroup';
import { PulseChannel } from '../apu';

type PulseStripProps = ChannelStripProps<PulseChannel> & {
    isPulse1?: boolean
}

export const PulseStrip = memo((props: PulseStripProps) => {

    const setUseEnvelope = useCallback((value: boolean) => {
        props.onChange({ constantVolume: !value });
    }, [props.onChange]);

    const setLoop = useCallback((value: boolean) => {
        props.onChange({ loop: value });
    }, [props.onChange]);

    const setVolume = useCallback((value: number) => {
        props.onChange({ volume: value });
    }, [props.onChange]);

    const setDutyCyle = useCallback((value: number) => {
        props.onChange({ dutyCycle: value });
    }, [props.onChange]);

    const setSweepEnabled = useCallback((val: boolean) => {
        props.onChange({ sweepEnabled: val });
    }, [props.onChange]);

    const setSweepNegate = useCallback((val: boolean) => {
        props.onChange({ sweepNegate: val });
    }, [props.onChange]);

    const setSweepShift = useCallback((val: number) => {
        props.onChange({ sweepShift: val });
    }, [props.onChange]);

    const setSweepPeriod = useCallback((val: number) => {
        props.onChange({ sweepPeriod: val });
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
                <div style={{ display: 'flex' }}>
                    <Slider
                        label={props.state.constantVolume ? 'Volume' : 'Envelope period'}
                        value={props.state.volume}
                        min={0}
                        max={0xF}
                        onChange={setVolume}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <Slider
                        label='Duty cycle'
                        value={props.state.dutyCycle}
                        min={0}
                        max={3}
                        onChange={setDutyCyle}
                        disabled={props.disabled || !props.state.enabled}
                    />
                </div>
            </ChannelStripGroup>
            <ChannelStripGroup label={props.isPulse1 ? '$4001' : '$4005'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
                    <Switch
                        label='Enable sweep' 
                        checked={props.state.sweepEnabled}
                        onChange={setSweepEnabled}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <Switch 
                        label='Negate sweep' 
                        checked={props.state.sweepNegate}
                        onChange={setSweepNegate}
                        disabled={props.disabled || !props.state.enabled}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <Slider
                        label='Sweep shift'
                        value={props.state.sweepShift}
                        min={0}
                        max={7}
                        onChange={setSweepShift}
                        disabled={props.disabled || !props.state.enabled}
                    />
                    <Slider
                        label='Sweep period'
                        value={props.state.sweepPeriod}
                        min={0}
                        max={7}
                        onChange={setSweepPeriod}
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