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

    const { label, onChange, state, disabled, isPulse1 } = props;

    const setUseEnvelope = useCallback((value: boolean) => {
        onChange({ constantVolume: !value });
    }, [onChange]);

    const setLoop = useCallback((value: boolean) => {
        onChange({ loop: value });
    }, [onChange]);

    const setVolume = useCallback((value: number) => {
        onChange({ volume: value });
    }, [onChange]);

    const setDutyCyle = useCallback((value: number) => {
        onChange({ dutyCycle: value });
    }, [onChange]);

    const setSweepEnabled = useCallback((val: boolean) => {
        onChange({ sweepEnabled: val });
    }, [onChange]);

    const setSweepNegate = useCallback((val: boolean) => {
        onChange({ sweepNegate: val });
    }, [onChange]);

    const setSweepShift = useCallback((val: number) => {
        onChange({ sweepShift: val });
    }, [onChange]);

    const setSweepPeriod = useCallback((val: number) => {
        onChange({ sweepPeriod: val });
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
        <ChannelStrip<PulseChannel> 
            state={state}
            label={label} 
            onChange={onChange}
            disabled={disabled}
        >
            <ChannelStripGroup label={isPulse1 ? '$4000' : '$4004'}>
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
                <div style={{ display: 'flex' }}>
                    <Slider
                        label={state.constantVolume ? 'Volume' : 'Envelope period'}
                        value={state.volume}
                        min={0}
                        max={0xF}
                        onChange={setVolume}
                        disabled={disabled || !state.enabled}
                    />
                    <Slider
                        label='Duty cycle'
                        value={state.dutyCycle}
                        min={0}
                        max={3}
                        onChange={setDutyCyle}
                        disabled={disabled || !state.enabled}
                    />
                </div>
            </ChannelStripGroup>
            <ChannelStripGroup label={isPulse1 ? '$4001' : '$4005'}>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
                    <Switch
                        label='Enable sweep' 
                        checked={state.sweepEnabled}
                        onChange={setSweepEnabled}
                        disabled={disabled || !state.enabled}
                    />
                    <Switch 
                        label='Negate sweep' 
                        checked={state.sweepNegate}
                        onChange={setSweepNegate}
                        disabled={disabled || !state.enabled}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <Slider
                        label='Sweep shift'
                        value={state.sweepShift}
                        min={0}
                        max={7}
                        onChange={setSweepShift}
                        disabled={disabled || !state.enabled}
                    />
                    <Slider
                        label='Sweep period'
                        value={state.sweepPeriod}
                        min={0}
                        max={7}
                        onChange={setSweepPeriod}
                        disabled={disabled || !state.enabled}
                    />
                </div>
            </ChannelStripGroup>
            <ChannelStripGroup label={isPulse1 ? '$4002 / $4003' : '$4006 / $4007'}>
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

PulseStrip.displayName = 'PulseStrip';