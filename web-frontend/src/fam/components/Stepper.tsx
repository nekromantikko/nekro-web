import React, { memo } from 'react';
import { Label } from './Label';
import { TactileButton } from './TactileButton';
import { DigitalDisplay } from './DigitalDisplay';

type StepperProps = {
    label?: string,
    value?: number,
    length?: number,
    onIncrement?: () => void,
    onDecrement?: () => void,
    disabled?: boolean
};

export const Stepper = memo(({ label = '', value = 0, length = 4, onIncrement, onDecrement, disabled }: StepperProps) => {
    const labelStr = `⮜ ${label} ⮞`;
    
    return (
        <div className="flex flex-col items-center m-2">
            <Label>{labelStr}</Label>
            <div className="flex flex-row gap-2">
                <TactileButton shape='rect' onPress={onDecrement} disabled={disabled} />
                <DigitalDisplay value={value} length={length} disabled={disabled} />
                <TactileButton shape='rect' onPress={onIncrement} disabled={disabled} />
            </div>
        </div>
    )
});

Stepper.displayName = 'Stepper';

