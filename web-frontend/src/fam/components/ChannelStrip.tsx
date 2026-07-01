import React, { memo, PropsWithChildren } from 'react';
import { SynthPanel } from './SynthPanel';
import { Channel, UpdateChannelAction } from '../apu';
import { Label } from './Label';

export type ChannelStripProps<T extends Channel = Channel> = {
    label: string,
    state: T,
    disabled?: boolean,
    onUpdateAction: (action: UpdateChannelAction<T>) => void
};

const wrapGenericMemo: <T>(component: T) => T = memo

export const ChannelStrip = wrapGenericMemo(<T extends Channel = Channel>({ label, children }: PropsWithChildren<ChannelStripProps<T>>) => {
    return (
        <SynthPanel>
            <div className="flex flex-col items-center text-center text-nowrap w-full">
                <div className="flex flex-row items-center justify-between w-full p-2">
                    <Label size='lg'>{label}</Label>
                </div>
                <div className="flex flex-wrap w-full">
                    {children}
                </div>
            </div>
        </SynthPanel>
    );
});