import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { TriangleChannel } from '../apu';
import { PanelSection } from './PanelSection';
import { Toggle } from './Toggle';
import { Knob } from './Knob';

type TriangleStripProps = ChannelStripProps<TriangleChannel>;

export const TriangleStrip = memo((props: TriangleStripProps) => {

    const { label, onUpdateAction, state, disabled } = props;

    const toggleLoop = useCallback(() => {
        onUpdateAction(prev => ({ loop: !prev.loop }));
    }, [onUpdateAction]);

    const setLengthCounterLoad = useCallback((value: number) => {
        if (!Number.isFinite(value)) return;

        onUpdateAction({ linearCounterLoad: Math.round(value) });
    }, [onUpdateAction]);

    return (
        <ChannelStrip<TriangleChannel>
            state={state}
            label={label}
            onUpdateAction={onUpdateAction}
            disabled={disabled}
        >
            <PanelSection label='duration'>
                <div className="flex flex-row">
                    <Toggle label='sustain' value={state.loop} onPress={toggleLoop} disabled={disabled} />
                </div>
                <Knob
                    label='length'
                    value={state.linearCounterLoad}
                    min={0}
                    max={0x7F}
                    steps={11}
                    onChange={setLengthCounterLoad}
                />
            </PanelSection>
        </ChannelStrip>
    )
});

TriangleStrip.displayName = 'TriangleStrip';