import React, { memo, useCallback } from 'react';
import { ChannelStrip, ChannelStripProps } from './ChannelStrip';
import { NoiseChannel } from '../apu';
import { EnvelopeSection } from './EnvelopeSection';
import { Toggle } from './Toggle';

type NoiseStripProps = ChannelStripProps<NoiseChannel>;

export const NoiseStrip = memo((props: NoiseStripProps) => {

    const { label, onUpdateAction, state, disabled } = props;


    const toggleMode = useCallback(() => {
            onUpdateAction(prev => ({ mode: !prev.mode }));
        }, [onUpdateAction]);

    return (
        <ChannelStrip<NoiseChannel>
            state={state}
            label={label}
            onUpdateAction={onUpdateAction}
            disabled={disabled}
        >
            <div className="flex flex-row">
                <Toggle label='mode' value={state.mode} onPress={toggleMode} disabled={disabled} />
            </div>
            <EnvelopeSection 
                constantVolume={state.constantVolume}
                loop={state.loop}
                volume={state.volume}
                disabled={disabled}
                onUpdateAction={onUpdateAction}
            />
        </ChannelStrip>
    )
});

NoiseStrip.displayName = 'NoiseStrip';