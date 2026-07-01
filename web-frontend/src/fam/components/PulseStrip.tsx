import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { PulseChannel } from '../apu';
import { PanelSection } from './PanelSection';
import { EnvelopeSection } from './EnvelopeSection';
import { Toggle } from './Toggle';
import { Knob } from './Knob';

type PulseStripProps = ChannelStripProps<PulseChannel>;

export const PulseStrip = memo((props: PulseStripProps) => {

    const { label, onUpdateAction, state, disabled } = props;

    const setDutyCycle = useCallback((value: number) => {
        if (!Number.isFinite(value)) return;
        
        onUpdateAction({ dutyCycle: Math.round(value) });
    }, [onUpdateAction]);

    const toggleSweepEnabled = useCallback(() => {
        onUpdateAction(prev => ({ sweepEnabled: !prev.sweepEnabled }));
    }, [onUpdateAction]);

    const toggleSweepNegate = useCallback(() => {
        onUpdateAction(prev => ({ sweepNegate: !prev.sweepNegate }));
    }, [onUpdateAction]);

    const setSweepShift = useCallback((value: number) => {
        if (!Number.isFinite(value)) return;
        
        onUpdateAction({ sweepShift: Math.round(value) });
    }, [onUpdateAction]);

    const setSweepPeriod = useCallback((value: number) => {
        if (!Number.isFinite(value)) return;
        
        onUpdateAction({ sweepPeriod: Math.round(value) });
    }, [onUpdateAction]);

    return (
        <ChannelStrip<PulseChannel> 
            state={state}
            label={label} 
            onUpdateAction={onUpdateAction}
            disabled={disabled}
        >
            <PanelSection label='waveform'>
                <Knob 
                    label='duty'
                    value={state.dutyCycle}
                    min={0}
                    max={3}
                    steps={4}
                    onChange={setDutyCycle}
                />
            </PanelSection>
            <EnvelopeSection 
                constantVolume={state.constantVolume}
                loop={state.loop}
                volume={state.volume}
                disabled={disabled}
                onUpdateAction={onUpdateAction}
            />
            <PanelSection label='sweep'>
                <div className="flex flex-row flex-wrap items-center basis-1/3 grow shrink justify-center">
                    <Toggle label='enable' value={state.sweepEnabled} onPress={toggleSweepEnabled} disabled={disabled} />
                    <Toggle label='negate' value={state.sweepNegate} onPress={toggleSweepNegate} disabled={disabled} />
                </div>
                <div className="flex flex-row flex-wrap items-center basis-2/3 grow shrink justify-center">
                    <Knob 
                        label='shift'
                        value={state.sweepShift}
                        min={0}
                        max={7}
                        steps={8}
                        onChange={setSweepShift}
                    />
                    <Knob 
                        label='period'
                        value={state.sweepPeriod}
                        min={0}
                        max={7}
                        steps={8}
                        onChange={setSweepPeriod}
                    />
                </div>
            </PanelSection>
            {/* <PanelSection label='timer'>
                <Stepper 
                    label='period'
                    value={state.timerPeriod}
                    length={4}
                    disabled={disabled}
                    onIncrement={incrementTimerPeriod}
                    onDecrement={decrementTimerPeriod}
                />
            </PanelSection> */}
            {/* <LengthCounterSection 
                lengthCounterLoad={state.lengthCounterLoad}
                onUpdateAction={onUpdateAction}
                disabled={disabled}
            /> */}
        </ChannelStrip>
    )
});

PulseStrip.displayName = 'PulseStrip';