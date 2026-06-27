import React, { memo } from 'react';

type DigitalDisplayProps = {
    value?: string | number,
    length?: number,
    disabled?: boolean
};

export const DigitalDisplay = memo(({ value, length = 3, disabled }: DigitalDisplayProps) => {
    const rawString = String(value).toUpperCase();
    const truncatedString = rawString.length > length 
        ? rawString.slice(-length)
        : rawString;
    const displayString = disabled ? '' : truncatedString.padStart(length, ' ');
    const skeletonString = '8'.repeat(length);

    return (
        <div className="
            inline-flex m-auto items-center justify-center px-4 py-1.5 rounded-md bg-neutral-800
            border border-neutral-800 shadow-[1px_1px_2px_rgba(255,255,255,0.2),inset_0_2px_4px_rgba(0,0,0,0.6),inset_1px_1px_1px_rgba(0,0,0,0.4)]
        ">
            <div className="relative font-digital font-bold tracking-wider text-2xl select-none">
                <span className="text-lime-900/15 font-light">
                    {skeletonString}
                </span>

                <span className="absolute inset-y-0 right-0 text-lime-500">
                    {displayString}
                </span>

                <span className="
                    absolute inset-y-0 right-0 text-lime-300/30 mix-blend-screen pointer-events-none blur-[5px]
                    z-1000
                ">
                    {displayString}
                </span>
            </div>
        </div>
    )
});

DigitalDisplay.displayName = 'DigitalDisplay';