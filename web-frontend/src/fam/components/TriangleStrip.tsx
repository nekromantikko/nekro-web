import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { TriangleChannel } from '../apu';
import { LengthCounterSection } from './LengthCounterSection';
import { PanelSection } from './PanelSection';
import { Stepper } from './Stepper';
import { Toggle } from './Toggle';

type TriangleStripProps = ChannelStripProps<TriangleChannel>;

export const TriangleStrip = memo((props: TriangleStripProps) => {

    const { label, onUpdateAction, state, disabled } = props;

    const toggleLoop = useCallback(() => {
        onUpdateAction(prev => ({ loop: !prev.loop }));
    }, [onUpdateAction]);

    const incrementLinearCounterLoad = useCallback(() => {
        onUpdateAction(prev => {
            const newVal = prev.linearCounterLoad < 0x7F ? prev.linearCounterLoad + 1 : 0;
            return { linearCounterLoad: newVal };
        });
    }, [onUpdateAction]);

    const decrementLinearCounterLoad = useCallback(() => {
        onUpdateAction(prev => {
            const newVal = prev.linearCounterLoad > 0 ? prev.linearCounterLoad - 1 : 0x7F;
            return { linearCounterLoad: newVal };
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
        <ChannelStrip<TriangleChannel>
            state={state}
            label={label}
            onUpdateAction={onUpdateAction}
            disabled={disabled}
        >
            <PanelSection label='linear counter'>
                <div className="flex flex-row grow">
                    <Toggle label='ctrl/loop' value={state.loop} onPress={toggleLoop} disabled={disabled} />
                </div>
                <Stepper 
                    label='load'
                    value={state.linearCounterLoad}
                    length={3}
                    disabled={disabled}
                    onIncrement={incrementLinearCounterLoad}
                    onDecrement={decrementLinearCounterLoad}
                />
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

TriangleStrip.displayName = 'TriangleStrip';