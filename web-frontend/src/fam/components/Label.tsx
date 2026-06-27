import React, { memo, PropsWithChildren } from 'react';

type LabelProps = {
    size?: 'sm' | 'md' | 'lg' | 'xl',
}

const sizeMaps = {
  sm: 'text-[10px]',
  md: 'text-[12px]',
  lg: 'text-[16px]',
  xl: 'text-[24px]',
};

export const Label = memo(({ size = 'md', children }: PropsWithChildren<LabelProps>) => {
    const sizeStyle = sizeMaps[size];

    return (
        <span className={`
            font-orbitron 
            ${sizeStyle}
            font-bold 
            uppercase 
            tracking-widest
            text-olive-300
        `}>
            {children}
        </span>
    )
});

Label.displayName = 'Label';