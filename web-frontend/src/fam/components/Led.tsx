import React, { memo } from 'react';

type LedColor = 'red' | 'green' | 'yellow' | 'blue';

type LedProps = {
    active?: boolean
    color?: LedColor,
    size?: 'sm' | 'md' | 'lg',
};

const colorMaps = {
  red: {
    off: 'bg-red-950 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15)]',
    on: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8),_inset_0_2px_4px_rgba(255,255,255,0.8)]',
  },
  green: {
    off: 'bg-lime-950 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15)]',
    on: 'bg-lime-600 shadow-[0_0_12px_rgba(163,230,53,0.8),_inset_0_2px_4px_rgba(255,255,255,0.8)]',
  },
  yellow: {
    off: 'bg-amber-950 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15)]',
    on: 'bg-amber-400 shadow-[0_0_12px_rgba(251,215,36,0.8),_inset_0_2px_4px_rgba(255,255,255,0.8)]',
  },
  blue: {
    off: 'bg-blue-950 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15)]',
    on: 'bg-blue-700 shadow-[0_0_12px_rgba(96,165,250,0.8),_inset_0_2px_4px_rgba(255,255,255,0.8)]',
  },
};

const sizeMaps = {
  sm: 'h-2.5 w-2.5',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
};

export const Led = memo(({ active = false, color = 'red', size = 'md' }: LedProps) => {
    const currentStyles = colorMaps[color];
    const sizeStyle = sizeMaps[size];

    return (
        <div className="
            inline-flex items-center justify-center p-0.5 rounded-full 
            grow-0 shrink-0 self-center select-none
            
            shadow-[0_1px_1px_rgba(255,255,255,0.2),_inset_0_5px_9px_rgba(0,0,0,0.7)]
        ">
            <div
                className={`
                    relative overflow-hidden rounded-full shrink-0
                    transition-all duration-150 ease-out
                    ${sizeStyle}
                    ${active ? currentStyles.on : currentStyles.off}
                `}
            >
                <div 
                    className="
                        absolute inset-0 rounded-full
                        bg-[radial-gradient(circle_at_35%_35%,_rgba(255,255,255,0.45)_0%,_transparent_65%)]
                        mix-blend-screen
                        pointer-events-none
                    "
                />
            </div>
        </div>
    )
});

Led.displayName = 'Led';