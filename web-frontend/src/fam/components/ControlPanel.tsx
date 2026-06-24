import React from 'react';
import { BaseModule } from './BaseModule';

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
            <button id="start-audio-btn" style={{padding: "10px 20px", fontSize: "16px", cursor: "pointer"}} onClick={toggleEnabled}>
                {props.enabled ? "Turn off" : "Turn on"}
            </button>
        </BaseModule>
    )
}