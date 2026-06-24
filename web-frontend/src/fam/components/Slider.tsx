import React from 'react';

type SliderProps = {
    label?: string,
    value?: number,
    min?: number,
    max?: number,
    disabled?: boolean,
    onChange?: (v: number) => void
};

export const Slider = (props: SliderProps) => {

    const setValue = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if (props.onChange) props.onChange(e.target.valueAsNumber);
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexFlow: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            textWrapMode: 'nowrap', 
            margin: '4px' 
        }}>
            <label>{props.label}</label>
            <input 
                style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                type="range"
                value={props.value}
                min={props.min}
                max={props.max}
                onChange={setValue}
                disabled={props.disabled}
            />
        </div>
    );
} 