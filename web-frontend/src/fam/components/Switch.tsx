import React from 'react';

type SwitchProps = {
    label?: string,
    checked?: boolean,
    disabled?: boolean,
    onChange?: (c: boolean) => void
};

export const Switch = (props: SwitchProps) => {
    const setChecked = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if (props.onChange) props.onChange(e.target.checked);
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
                type='checkbox' 
                checked={props.checked} 
                onChange={setChecked}
                disabled={props.disabled}
            />
        </div>
    );
}