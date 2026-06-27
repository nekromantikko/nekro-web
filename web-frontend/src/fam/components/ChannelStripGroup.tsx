import React, { memo, PropsWithChildren } from 'react';

export const ChannelStripGroup = memo((props: PropsWithChildren) => {
    return (
        <div className="flex items-stretch my-2 w-full justify-between flex-[1_1_0]">
            {props.children}
        </div>
    )
});

ChannelStripGroup.displayName = 'ChannelStripGroup';