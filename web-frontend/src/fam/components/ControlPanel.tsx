import React, { memo, useCallback } from 'react';
import { SynthPanel } from './SynthPanel';
import { Led } from './Led';
import { Label } from './Label';
import { TactileButton } from './TactileButton';
import { ChannelId } from '../apu';
import { Stepper } from './Stepper';

type ControlPanelProps = {
    channel: ChannelId,
    enabled?: boolean,
    onSetEnabled: (v: boolean) => void
    onSetChannel: React.Dispatch<React.SetStateAction<ChannelId>>
}

const availableChannels: ChannelId[] = ['pulse1', 'pulse2', 'triangle', 'noise'];

export const ControlPanel = memo(({ channel, enabled = false, onSetEnabled, onSetChannel }: ControlPanelProps) => {
    const toggleEnabled = useCallback(() => {
        if (onSetEnabled) onSetEnabled(enabled ? false : true);
    }, [enabled, onSetEnabled]);

    const incrementChannel = useCallback(() => {
        onSetChannel(prev => {
            const prevIndex = availableChannels.indexOf(prev);
            const newIndex = prevIndex < availableChannels.length - 1 ? prevIndex + 1 : 0;
            return availableChannels[newIndex];
        });
    }, [onSetChannel]);
    
    const decrementChannel = useCallback(() => {
        onSetChannel(prev => {
            const prevIndex = availableChannels.indexOf(prev);
            const newIndex = prevIndex > 0 ? prevIndex - 1 : availableChannels.length - 1;
            return availableChannels[newIndex];
        });
    }, [onSetChannel]);

    return (
        <SynthPanel>
            <div className="flex flex-row items-center justify-between grow px-2">
                <div className="flex flex-row items-center gap-4">
                    <div className="flex flex-col justify-center">
                        <Label>on</Label>
                        <Led active={enabled} />
                    </div>
                    <TactileButton shape='rect' onPress={toggleEnabled} />
                </div>
                <Stepper
                    label='kb channel'
                    value={availableChannels.indexOf(channel)}
                    length={1}
                    disabled={!enabled}
                    onDecrement={decrementChannel}
                    onIncrement={incrementChannel}
                />
                <div className="absolute inset-0 flex flex-row items-center justify-center pointer-events-none">
                    <Label size='xl'>fam sandbox v1.0</Label>
                </div>
            </div>
        </SynthPanel>
    )
});

ControlPanel.displayName = 'ControlPanel';