import React from 'react';
import { BaseModule } from './BaseModule';
import { Led } from './Led';

type ControlPanelProps = {
    enabled?: boolean,
    onSetEnabled?: (v: boolean) => void
}

export const ControlPanel = (props: ControlPanelProps) => {
    const toggleEnabled = () => {
        if (props.onSetEnabled) props.onSetEnabled(props.enabled ? false : true);
    }

    return (
        <BaseModule>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Led active={props.enabled} color='green' />
                <button id="start-audio-btn" style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", background: props.enabled ? 'lime' : 'darkred' }} onClick={toggleEnabled}>
                    {props.enabled ? "Turn off" : "Turn on"}
                </button>
            </div>
        </BaseModule>
    )
}