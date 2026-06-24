import React, { PropsWithChildren } from 'react';

type ChannelStripGroupProps = {
    label?: string,
}

export const ChannelStripGroup = (props: PropsWithChildren<ChannelStripGroupProps>) => {
    return (
        <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', flex: '1 1 0' }}>
            <div style={{ display: 'flex', width: '100%' }}>
                <label style={{ fontSize: 'smaller', color: 'yellow' }}>
                    {props.label}
                </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {props.children}
            </div>
        </div>
    )
}