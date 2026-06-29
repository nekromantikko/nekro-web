import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { PulseChannel } from '../apu';
import { PanelSection } from './PanelSection';
import { EnvelopeSection } from './EnvelopeSection';
import { Stepper } from './Stepper';
import { LengthCounterSection } from './LengthCounterSection';
import { Toggle } from './Toggle';

type PulseStripProps = ChannelStripProps<PulseChannel>;

export const PulseStrip = memo((props: PulseStripProps) => {

    const { label, onUpdateAction, state, disabled } = props;

    const incrementDutyCycle = useCallback(() => {
        onUpdateAction(prev => {
            const newCycle = prev.dutyCycle < 3 ? prev.dutyCycle + 1 : 0;
            return { dutyCycle: newCycle };
        });
    }, [onUpdateAction]);

    const decrementDutyCycle = useCallback(() => {
        onUpdateAction(prev => {
            const newCycle = prev.dutyCycle > 0 ? prev.dutyCycle - 1 : 3;
            return { dutyCycle: newCycle };
        });
    }, [onUpdateAction]);

    const toggleSweepEnabled = useCallback(() => {
        onUpdateAction(prev => ({ sweepEnabled: !prev.sweepEnabled }));
    }, [onUpdateAction]);

    const toggleSweepNegate = useCallback(() => {
        onUpdateAction(prev => ({ sweepNegate: !prev.sweepNegate }));
    }, [onUpdateAction]);

    const incrementSweepShift = useCallback(() => {
        onUpdateAction(prev => {
            const newShift = prev.sweepShift < 7 ? prev.sweepShift + 1 : 0;
            return { sweepShift: newShift };
        });
    }, [onUpdateAction]);

    const decrementSweepShift = useCallback(() => {
        onUpdateAction(prev => {
            const newShift = prev.sweepShift > 0 ? prev.sweepShift - 1 : 7;
            return { sweepShift: newShift };
        });
    }, [onUpdateAction]);

    const incrementSweepPeriod = useCallback(() => {
        onUpdateAction(prev => {
            const newPeriod = prev.sweepPeriod < 7 ? prev.sweepPeriod + 1 : 0;
            return { sweepPeriod: newPeriod };
        });
    }, [onUpdateAction]);

    const decrementSweepPeriod = useCallback(() => {
        onUpdateAction(prev => {
            const newPeriod = prev.sweepPeriod > 0 ? prev.sweepPeriod - 1 : 7;
            return { sweepPeriod: newPeriod };
        });
    }, [onUpdateAction]);

    const incrementTimerPeriod = useCallback(() => {
        onUpdateAction(prev => {
            const newPeriod = prev.timerPeriod < 0x7FF ? prev.timerPeriod + 1 : 0;
            return { timerPeriod: newPeriod };
        });
    }, [onUpdateAction]);

    const decrementTimerPeriod = useCallback(() => {
        onUpdateAction(prev => {
            const newPeriod = prev.timerPeriod > 0 ? prev.timerPeriod - 1 : 0x7FF;
            return { timerPeriod: newPeriod };
        });
    }, [onUpdateAction]);

    return (
        <ChannelStrip<PulseChannel> 
            state={state}
            label={label} 
            onUpdateAction={onUpdateAction}
            disabled={disabled}
        >
            <EnvelopeSection 
                constantVolume={state.constantVolume}
                loop={state.loop}
                volume={state.volume}
                disabled={disabled}
                onUpdateAction={onUpdateAction}
            />
            <PanelSection label='duty'>
                <Stepper 
                    label='cycle'
                    value={state.dutyCycle}
                    length={1}
                    disabled={disabled}
                    onIncrement={incrementDutyCycle}
                    onDecrement={decrementDutyCycle}
                />
            </PanelSection>
            <PanelSection label='sweep'>
                <div className="flex flex-row flex-wrap items-center basis-1/3 grow shrink justify-center">
                    <Toggle label='enable' value={state.sweepEnabled} onPress={toggleSweepEnabled} disabled={disabled} />
                    <Toggle label='negate' value={state.sweepNegate} onPress={toggleSweepNegate} disabled={disabled} />
                </div>
                <div className="flex flex-row flex-wrap items-center basis-2/3 grow shrink justify-center">
                    <Stepper 
                        label='shift'
                        value={state.sweepShift}
                        length={1}
                        disabled={disabled}
                        onIncrement={incrementSweepShift}
                        onDecrement={decrementSweepShift}
                    />
                    <Stepper 
                        label='period'
                        value={state.sweepPeriod}
                        length={1}
                        disabled={disabled}
                        onIncrement={incrementSweepPeriod}
                        onDecrement={decrementSweepPeriod}
                    />
                </div>
            </PanelSection>
            <PanelSection label='timer'>
                <Stepper 
                    label='period'
                    value={state.timerPeriod}
                    length={4}
                    disabled={disabled}
                    onIncrement={incrementTimerPeriod}
                    onDecrement={decrementTimerPeriod}
                />
            </PanelSection>
            <LengthCounterSection 
                lengthCounterLoad={state.lengthCounterLoad}
                onUpdateAction={onUpdateAction}
                disabled={disabled}
            />
        </ChannelStrip>
    )
});

PulseStrip.displayName = 'PulseStrip';