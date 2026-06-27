import React, { memo } from "react";
import { Led } from './Led';
import { Label } from './Label';
import { TactileButton } from './TactileButton';

type ToggleProps = {
    label?: string,
    value?: boolean,
    disabled?: boolean,
    onPress?: () => void
};

export const Toggle = memo(({ label, value, disabled, onPress }: ToggleProps) => {
    return (
        <div className="flex flex-col items-center gap-1 m-2">
            <div className="flex flex-row items-center gap-2">
                <Led color='green' active={!disabled && value} />
                <Label>{label}</Label>
            </div>
            <TactileButton shape='rect' onPress={onPress} disabled={disabled} />
        </div>
    );
});

Toggle.displayName = 'Toggle';