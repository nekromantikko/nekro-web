import React, { memo, PropsWithChildren, useCallback } from 'react';
import { SynthPanel } from './SynthPanel';
import { Channel, UpdateChannelAction } from '../apu';
import { Label } from './Label';
import { Led } from './Led';
import { TactileButton } from './TactileButton';

export type ChannelStripProps<T extends Channel = Channel> = {
    label: string,
    state: T,
    disabled?: boolean,
    onUpdateAction: (action: UpdateChannelAction<T>) => void
};

const wrapGenericMemo: <T>(component: T) => T = memo

export const ChannelStrip = wrapGenericMemo(<T extends Channel = Channel>({ label, state, onUpdateAction, disabled, children }: PropsWithChildren<ChannelStripProps<T>>) => {
    const toggleEnabled = useCallback(() => {
        onUpdateAction(prev => ({ enabled: !prev.enabled } as Partial<T>));
    }, [onUpdateAction])

    return (
        <SynthPanel>
            <div className="flex flex-col items-center text-center text-nowrap w-full">
                <div className="flex flex-row items-center justify-between w-full p-2">
                    <Label size='lg'>{label}</Label>
                    <div className="flex flex-row items-center gap-4">
                        <div className="flex flex-row items-center gap-2">
                            <Led color='yellow' active={!disabled && state.enabled} />
                            <Label>enabled</Label>
                        </div>
                        <TactileButton disabled={disabled} onPress={toggleEnabled} />
                    </div>
                </div>
                <div className="flex flex-wrap flex-[1_1_0]">
                    {children}
                </div>
            </div>
        </SynthPanel>
    );
});