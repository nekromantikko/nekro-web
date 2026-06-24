import React, { PropsWithChildren } from 'react';
import { BaseModule } from './BaseModule';

export type ChannelStripProps = {
    label?: string,
    enabled?: boolean,
    onSetEnabled?: (v: boolean) => void
};

export const ChannelStrip = (props: PropsWithChildren<ChannelStripProps>) => {
    const setEnabled = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if (props.onSetEnabled) props.onSetEnabled(e.target.checked)
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
                    <input type='checkbox' checked={props.enabled} onChange={setEnabled} />
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
}