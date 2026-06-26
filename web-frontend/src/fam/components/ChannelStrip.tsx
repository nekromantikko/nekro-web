import React, { memo, PropsWithChildren } from 'react';
import { BaseModule } from './BaseModule';
import { Channel } from '../apu';

export type ChannelStripProps<T extends Channel = Channel> = {
    label: string,
    state: T,
    onChange: (payload: Partial<T>) => void,
    disabled?: boolean,
};

const wrapGenericMemo: <T>(component: T) => T = memo

export const ChannelStrip = wrapGenericMemo(<T extends Channel = Channel>(props: PropsWithChildren<ChannelStripProps<T>>) => {
    const setEnabled = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        props.onChange({ enabled: e.target.checked } as Partial<T>);
    }

    return (
        <BaseModule>
            <div style={{ 
                display: 'flex', 
                flexFlow: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                textWrapMode: 'nowrap',
                width: '100%'
            }}>
                <div>
                    <input type='checkbox' checked={props.state.enabled} onChange={setEnabled} disabled={props.disabled} />
                    <label>{props.label}</label>
                </div>
                <div style={{ 
                    marginTop: '16px',
                    display: 'flex',
                    flexFlow: 'column',
                    flex: '1 1 0',
                    width: '100%'
                }}>
                    {props.children}
                </div>
            </div>
        </BaseModule>
    );
});