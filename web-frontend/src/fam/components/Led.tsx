import React, { memo } from 'react';

type LedColor = 'red' | 'green' | 'yellow' | 'blue';

type LedProps = {
    active?: boolean
    color?: LedColor,
    size?: 'sm' | 'md' | 'lg',
};

const colorMaps = {
  red: {
    off: 'bg-red-950/80 border-red-900/40',
    on: 'bg-red-500 border-red-400/50',
    glow: 'from-white via-red-500 via-5% to-black to-75%',
  },
  green: {
    off: 'bg-lime-950/80 border-lime-900/40',
    on: 'bg-lime-500 border-lime-400/50',
    glow: 'from-white via-lime-500 via-5% to-black to-75%',
  },
  yellow: {
    off: 'bg-amber-950/80 border-amber-900/40',
    on: 'bg-amber-400 border-amber-300/50',
    glow: 'from-white via-amber-400 via-5% to-black to-75%',
  },
  blue: {
    off: 'bg-blue-950/80 border-blue-900/40',
    on: 'bg-blue-600 border-blue-500/50',
    glow: 'from-white via-blue-500 via-5% to-black to-75%',
  },
};

const sizeMaps = {
  sm: { core: 'h-2.5 w-2.5', flare: '-inset-2' },
  md: { core: 'h-4 w-4', flare: '-inset-4' },
  lg: { core: 'h-6 w-6', flare: '-inset-6' },
};

export const Led = memo(({ active = false, color = 'red', size = 'md' }: LedProps) => {
    const currentStyles = colorMaps[color];
    const sizeStyle = sizeMaps[size];

    return (
        <div className="relative inline-flex items-center justify-center">
            <div className="
                inline-flex items-center justify-center p-0.5 rounded-full 
                grow-0 shrink-0 self-center select-none
                
                shadow-[0_1px_1px_rgba(255,255,255,0.2),inset_0_5px_9px_rgba(0,0,0,0.7)]
            ">
                <div
                    className={`
                        relative overflow-hidden rounded-full shrink-0
                        transition-all duration-150 ease-out
                        ${sizeStyle.core}
                        ${active ? currentStyles.on : currentStyles.off}
                    `}
                >
                    <div 
                        className="
                            absolute inset-0 rounded-full
                            bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.45)_0%,transparent_65%)]
                            mix-blend-screen
                            pointer-events-none
                        "
                    />
                </div>
            </div>
            <div
                className={`
                    absolute rounded-full pointer-events-none mix-blend-screen z-1000
                    bg-radial transition-all duration-150 ease-out
                    
                    ${sizeStyle.flare}
                    
                    ${currentStyles.glow}
                    
                    ${active ? 'opacity-50 scale-100' : 'opacity-0 scale-75'}
                `}
            />
        </div>
    )
});

Led.displayName = 'Led';