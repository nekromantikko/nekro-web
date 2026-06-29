import React, { memo, PropsWithChildren } from 'react';
import { Label } from './Label';

type PanelSectionProps = {
    label?: string,
    solid?: boolean
};

export const PanelSection = memo(({ label, solid, children }: PropsWithChildren<PanelSectionProps>) => {
    return (
        <div className={`
            border-solid
            border-olive-300
            border-2
            rounded-2xl
            px-2
            py-3
            m-2
            ${solid ? 'bg-olive-300' : 'bg-transparent'}
            relative
            flex-[1_1_0]
            flex flex-row flex-wrap justify-around items-center
        `}>
            <div className="absolute inset-x-0 top-0 -translate-y-1/2 flex justify-center">
                <div className="bg-mist-600 px-2 py-1 rounded-full">
                    <Label>{label}</Label>
                </div>
            </div>
            {children}
        </div>
    )
});

PanelSection.displayName = 'PanelSection';