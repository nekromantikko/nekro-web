import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { NoiseChannel } from '../apu';
import { EnvelopeSection } from './EnvelopeSection';
import { LengthCounterSection } from './LengthCounterSection';
import { PanelSection } from './PanelSection';
import { Toggle } from './Toggle';
import { Stepper } from './Stepper';

type NoiseStripProps = ChannelStripProps<NoiseChannel>;

export const NoiseStrip = memo((props: NoiseStripProps) => {

    const { label, onUpdateAction, state, disabled } = props;


    const toggleMode = useCallback(() => {
            onUpdateAction(prev => ({ mode: !prev.mode }));
        }, [onUpdateAction]);

    const incrementPeriod = useCallback(() => {
        onUpdateAction(prev => {
            const newPeriod = prev.period < 0xF ? prev.period + 1 : 0;
            return { period: newPeriod };
        });
    }, [onUpdateAction]);

    const decrementPeriod = useCallback(() => {
        onUpdateAction(prev => {
            const newPeriod = prev.period > 0 ? prev.period - 1 : 0xF;
            return { period: newPeriod };
        });
    }, [onUpdateAction]);

    return (
        <ChannelStrip<NoiseChannel>
            state={state}
            label={label}
            onUpdateAction={onUpdateAction}
            disabled={disabled}
        >
            <div className="flex flex-col flex-[1_1_0] justify-between">
                <div>
                    <EnvelopeSection 
                        constantVolume={state.constantVolume}
                        loop={state.loop}
                        volume={state.volume}
                        disabled={disabled}
                        onUpdateAction={onUpdateAction}
                    />
                </div>
                <div className="flex flex-row flex-wrap items-center">
                    <PanelSection label='timer'>
                        <div className="flex flex-row grow">
                            <Toggle label='mode' value={state.mode} onPress={toggleMode} disabled={disabled} />
                        </div>
                        <Stepper
                            label='period'
                            value={state.period}
                            length={2}
                            disabled={disabled}
                            onIncrement={incrementPeriod}
                            onDecrement={decrementPeriod}
                        />
                    </PanelSection>
                    <LengthCounterSection
                        lengthCounterLoad={state.lengthCounterLoad}
                        onUpdateAction={onUpdateAction}
                        disabled={disabled}
                    />
                </div>
            </div>
        </ChannelStrip>
    )
});

NoiseStrip.displayName = 'NoiseStrip';