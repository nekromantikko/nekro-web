import React, { memo } from 'react';

type KeyboardKeyProps = {
    midiNote: number,
    baseWidthPercent: number,
    isBlack?: boolean,
    isExtra?: boolean,
    disabled?: boolean,
    active?: boolean,
    onPlayNote: (note: number) => void
    onStopNote: (note: number) => void
}

export const KeyboardKey = memo((props: KeyboardKeyProps) => {
    const color = (props.active && !props.disabled) ? 'yellow' : props.isBlack ? '#222' : (props.isExtra ? '#444' : '#ccc');

    const handlePointerDown = () => {
        if (props.disabled) return;
        props.onPlayNote(props.midiNote);
    }

    const handlePointerEnter = (e: React.PointerEvent) => {
        if (props.disabled) return;

        // Check primary button / touch
        if (e.buttons === 1) {
            props.onPlayNote(props.midiNote);
        }
    }

    const handlePointerUpOrLeave = () => {
        props.onStopNote(props.midiNote);
    }

    return (
        <div style={{
            minWidth: props.isBlack ? 0 : `${props.baseWidthPercent}cqw`,
            height: '100%',
            display: 'flex',
            alignItems: 'stretch',
            flex: 0,
            touchAction: 'none',
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
        
                    cursor: props.disabled ? 'default' : 'pointer',
                    touchAction: 'none',
                }}
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
                onPointerUp={handlePointerUpOrLeave}
                onPointerLeave={handlePointerUpOrLeave}
                disabled={props.disabled}
            />
        </div>
    )
});

KeyboardKey.displayName = 'KeyboardKey';