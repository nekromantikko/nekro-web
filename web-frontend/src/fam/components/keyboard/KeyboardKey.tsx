import React, { memo } from 'react';

type KeyboardKeyProps = {
    midiNote: number,
    baseWidthPercent: number,
    isBlack?: boolean,
    isExtra?: boolean,
    active?: boolean,
    onPlayNote: (note: number) => void
    onStopNote: (note: number) => void
}

export const KeyboardKey = memo((props: KeyboardKeyProps) => {
    const colorStyle = props.active ? 'bg-yellow-300' : props.isBlack ? 'bg-neutral-900' : (props.isExtra ? 'bg-neutral-800' : 'bg-neutral-300');
    const aspectStyle = props.isBlack ? 'aspect-3/20' : 'aspect-1/5';
    const zIndexStyle = props.isBlack ? 'z-2' : 'z-1';
    const transformStyle = props.isBlack ? 'transform-[translate(-50%)]' : 'transform-none';
    const shadowStyle = props.active 
        ? 'shadow-[1px_1px_2px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.6),inset_1px_1px_1px_rgba(0,0,0,0.4)]'
        : 'shadow-[3px_3px_8px_rgba(0,0,0,0.7),inset_0_0_2px_--theme(--color-mist-800),inset_-2px_-2px_1px_rgba(0,0,0,0.2),inset_2px_2px_1px_rgba(255,255,255,0.2)]';

    const handlePointerDown = () => {
        props.onPlayNote(props.midiNote);
    }

    const handlePointerEnter = (e: React.PointerEvent) => {
        // Check primary button / touch
        if (e.buttons === 1) {
            props.onPlayNote(props.midiNote);
        }
    }

    const handlePointerUpOrLeave = () => {
        props.onStopNote(props.midiNote);
    }

    return (
        <div className={`
                h-full
                flex
                items-stretch
                flex-0
                touch-none
            `}
            style={{ minWidth: props.isBlack ? 0 : `${props.baseWidthPercent}cqw` }}
        >
            <button 
                className={`
                    ${colorStyle}
                    ${aspectStyle}
                    ${zIndexStyle}
                    ${transformStyle}
                    ${shadowStyle}
                    flex-0
                    p-0
                    touch-none
                    cursor-pointer
                `}
                style={{ minWidth: props.isBlack ? `${props.baseWidthPercent / 2}cqw` : '100%' }}
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
                onPointerUp={handlePointerUpOrLeave}
                onPointerLeave={handlePointerUpOrLeave}
            />
        </div>
    )
});

KeyboardKey.displayName = 'KeyboardKey';