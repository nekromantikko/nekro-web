import React, { memo, PropsWithChildren } from 'react';

export const Synth = memo((props: PropsWithChildren) => {
    return (
        <div className="relative">
            <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-mist-400 to-mist-50 z-100 mix-blend-multiply" />
            {props.children}
        </div>
    )
});

Synth.displayName = 'Synth';