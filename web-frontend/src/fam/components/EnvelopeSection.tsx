import React, { memo, useCallback } from 'react';
import { PanelSection } from './PanelSection';
import { Led } from './Led';
import { Label } from './Label';
import { Toggle } from './Toggle';
import { Knob } from './Knob';

type EnvelopeState = {
    constantVolume: boolean, 
    loop: boolean, 
    volume: number
};

type EnvelopeSectionProps = {
    constantVolume: boolean,
    loop: boolean,
    volume: number,
    disabled?: boolean,
    onUpdateAction: (action: Partial<EnvelopeState> | ((prev: EnvelopeState) => Partial<EnvelopeState>)) => void
};

export const EnvelopeSection = memo(({ constantVolume, volume, disabled, onUpdateAction}: EnvelopeSectionProps) => {
    const toggleConstantVolume = useCallback(() => {
        onUpdateAction(prev => ({ constantVolume: !prev.constantVolume, loop: !prev.constantVolume }));
    }, [onUpdateAction]);

    const setVolume = useCallback((value: number) => {
        if (!Number.isFinite(value)) return;

        onUpdateAction({ volume: Math.round(value) });
    }, [onUpdateAction]);

    return (
        <PanelSection label='volume'>
            <div className="flex flex-col items-center gap-1 m-2 *:first:m-0">
                <Toggle label='envelope' value={!constantVolume} onPress={toggleConstantVolume} disabled={disabled} />
                <div className="flex flex-row items-center gap-2">
                    <Led color='green' active={!disabled && constantVolume} />
                    <Label size='sm'>constant</Label>
                </div>
            </div>
            <Knob 
                label='volume/decay'
                value={volume}
                min={0}
                max={0xF}
                steps={0x10}
                onChange={setVolume}
            />
        </PanelSection>
    )
});

EnvelopeSection.displayName = 'EnvelopeSection';