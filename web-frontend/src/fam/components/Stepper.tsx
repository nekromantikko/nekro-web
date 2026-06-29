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

const ArrowLeftIcon = ({ className = 'w-8 h-8 text-olive-300'}: { className?: string}) => (
    <svg 
        viewBox="0 0 24 24" 
        className={className} 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M14 7l-5 5 5 5V7z" />
    </svg>
);

const ArrowRightIcon = ({ className = 'w-8 h-8 text-olive-300' }: { className?: string }) => (
    <svg 
        viewBox="0 0 24 24" 
        className={className} 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M10 17l5-5-5-5v10z" />
    </svg>
);

export const Stepper = memo(({ label = '', value = 0, length = 4, onIncrement, onDecrement, disabled }: StepperProps) => {
    
    return (
        <div className="flex flex-col items-center m-2">
            <div className="flex flex-row items-center">
                <ArrowLeftIcon />
                <Label>{label}</Label>
                <ArrowRightIcon />
            </div>
            <div className="flex flex-row gap-2">
                <TactileButton shape='rect' onPress={onDecrement} disabled={disabled} />
                <DigitalDisplay value={value} length={length} disabled={disabled} />
                <TactileButton shape='rect' onPress={onIncrement} disabled={disabled} />
            </div>
        </div>
    )
});

Stepper.displayName = 'Stepper';

