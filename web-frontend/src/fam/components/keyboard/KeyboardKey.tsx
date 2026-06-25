import React from 'react';

type KeyboardKeyProps = {
    baseWidthPercent: number,
    isBlack?: boolean,
    isExtra?: boolean,
    disabled?: boolean,
    onPlayNote?: () => void
}

export const KeyboardKey = (props: KeyboardKeyProps) => {
    const color = props.isBlack ? '#222' : (props.isExtra ? '#444' : '#ccc');

    const handlePlayNote = () => {
        if (props.onPlayNote) props.onPlayNote();
    }

    return (
        <div style={{
            minWidth: props.isBlack ? 0 : `${props.baseWidthPercent}cqw`,
            height: '100%',
            display: 'flex',
            alignItems: 'stretch',
            flex: 0,
        }}>
            <button 
                style={{ 
                    background: color,
                    minWidth: props.isBlack ? `${props.baseWidthPercent / 2}cqw` : '100%',
                    aspectRatio: props.isBlack ? 3 / 20 : 1 / 5,
                    flex: 0,
                    zIndex: props.isBlack ? 2 : 1,
                    transform: props.isBlack ? 'translate(-50%)' : 'none',
                    padding: 0,
        
                    cursor: props.disabled ? 'default' : 'pointer'
                }}
                onPointerDown={props.disabled ? undefined : handlePlayNote}
                disabled={props.disabled}
            />
        </div>
    )
}