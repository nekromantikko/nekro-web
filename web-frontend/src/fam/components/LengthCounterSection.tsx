import React, { memo, useCallback } from 'react';
import { PanelSection } from './PanelSection';
import { Stepper } from './Stepper';
import { TactileButton } from './TactileButton';
import { Label } from './Label';

type LengthCounterState = {
    lengthCounterLoad: number
};

type LengthCounterSectionProps = {
    lengthCounterLoad: number,
    disabled?: boolean,
    onUpdateAction: (action: Partial<LengthCounterState> | ((prev: LengthCounterState) => Partial<LengthCounterState>)) => void
}

export const LengthCounterSection = memo(({ lengthCounterLoad, disabled, onUpdateAction }: LengthCounterSectionProps) => {
    const incrementCounter = useCallback(() => {
        onUpdateAction(prev => {
            const newVal = prev.lengthCounterLoad < 0x1F ? prev.lengthCounterLoad + 1 : 0;
            return { lengthCounterLoad: newVal };
        });
    }, [onUpdateAction]);

    const decrementCounter = useCallback(() => {
        onUpdateAction(prev => {
            const newVal = prev.lengthCounterLoad > 0 ? prev.lengthCounterLoad - 1 : 0x1F;
            return { lengthCounterLoad: newVal };
        });
    }, [onUpdateAction]);

    const triggerNote = useCallback(() => {
        onUpdateAction(prev => ({ lengthCounterLoad: prev.lengthCounterLoad }));
    }, [onUpdateAction]);
    
    return (
        <PanelSection label='length counter'>
            <Stepper 
                label='load'
                value={lengthCounterLoad}
                length={2}
                onIncrement={incrementCounter}
                onDecrement={decrementCounter}
                disabled={disabled}
            />
            <div className="flex flex-row grow justify-end">
                <div className="flex flex-col items-stretch gap-1 m-2" >
                    <Label>trigger</Label>
                    <TactileButton 
                        shape='rect'
                        onPress={triggerNote}
                        disabled={disabled}
                    />
                </div>
            </div>
        </PanelSection>
    )
});

LengthCounterSection.displayName = 'LengthCounterSection';