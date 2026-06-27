import React, { memo } from 'react';

type TactileButtonProps = {
    shape?: 'circle' | 'rect',
    disabled?: boolean,
    onPress?: () => void
};

export const TactileButton = memo(({ shape = 'circle', disabled, onPress }: TactileButtonProps) => {
    const isCircle = shape === 'circle';

    return (
        <div className={`
            inline-flex items-center justify-center p-0.5 
            ${isCircle ? 'rounded-full' : 'rounded-lg'}
            grow-0 shrink-0 self-center select-none
            
            shadow-[0_1px_1px_rgba(255,255,255,0.2),inset_0_5px_9px_rgba(0,0,0,0.7)]
        `}>
            <button
                className={`
                    h-8 
                    ${isCircle ? 'w-8' : 'w-16'}
                    ${isCircle ? 'rounded-full' : 'rounded-md'}
                    bg-mist-700
                    shadow-[3px_3px_8px_rgba(0,0,0,0.7),inset_0_0_2px_--theme(--color-mist-800),inset_-2px_-2px_1px_rgba(0,0,0,0.2),inset_2px_2px_1px_rgba(255,255,255,0.2)]
                    active:shadow-[1px_1px_2px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.6),inset_1px_1px_1px_rgba(0,0,0,0.4)]
                `}
                disabled={disabled}
                onClick={onPress} 
            />
        </div>
    )
});

TactileButton.displayName = 'TactileButton';