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

export const EnvelopeSection = memo(({ constantVolume, loop, volume, disabled, onUpdateAction}: EnvelopeSectionProps) => {
    const toggleConstantVolume = useCallback(() => {
        onUpdateAction(prev => ({ constantVolume: !prev.constantVolume }));
    }, [onUpdateAction]);

    const toggleLoop = useCallback(() => {
        onUpdateAction(prev => ({ loop: !prev.loop }));
    }, [onUpdateAction]);

    const setVolume = useCallback((value: number) => {
        if (!Number.isFinite(value)) return;

        onUpdateAction({ volume: Math.round(value) });
    }, [onUpdateAction]);

    return (
        <PanelSection label='envelope'>
            <div className="flex flex-row flex-wrap items-baseline basis-1/3 grow shrink justify-between mx-2">
                <div className="flex flex-col items-center gap-1 m-2 *:first:m-0">
                    <Toggle label='envelope' value={!constantVolume} onPress={toggleConstantVolume} disabled={disabled} />
                    <div className="flex flex-row items-center gap-2">
                        <Led color='green' active={!disabled && constantVolume} />
                        <Label>constvol</Label>
                    </div>
                </div>
                <Toggle label='loop' value={loop} onPress={toggleLoop} disabled={disabled} />
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