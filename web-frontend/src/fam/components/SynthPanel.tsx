import React, { memo, PropsWithChildren } from 'react';

export const SynthPanel = memo((props: PropsWithChildren) => {
    return (
        <div className="
            flex flex-1 p-2
            bg-mist-600

            shadow-[inset_0_0_2px_--theme(--color-mist-800),inset_-2px_-2px_1px_rgba(0,0,0,0.2),inset_2px_2px_1px_rgba(255,255,255,0.2)]
            border border-mist-800
            relative
        ">
            {props.children}
        </div>
    );
});

SynthPanel.displayName = 'SynthPanel';