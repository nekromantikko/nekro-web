import React, { useEffect, useRef, useState } from 'react';
import { KeyboardKey } from './KeyboardKey';

type KeyboardProps = {
    minNote?: number,
    maxNote?: number,
    onPlayNote?: (midiNote: number) => void,
}

export const Keyboard = (props: KeyboardProps) => {
    const totalKeys = 97;
    const whiteKeys = 57;
    const notePattern = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const blackNoteIndices = [1, 3, 6, 8, 10];

    const whiteKeyWidthPercent = 100 / whiteKeys;

    const handlePlayNote = (midiNote: number) => {
        if (props.onPlayNote) props.onPlayNote(midiNote);
    }

    const keys = Array.from({ length: totalKeys }, (_, index) => {
        const patternIndex = index % 12;
        const octave = Math.floor(index / 12);
        const midiNote = index + 12;

        const noteName = `${notePattern[patternIndex]}${octave}`;
        const isBlack = blackNoteIndices.includes(patternIndex);
        const isExtra = index < 9; // Imperial Bösendorfer extra bass keys starting from C0
        const disabled = (props.minNote != null && props.minNote > midiNote) || (props.maxNote != null && props.maxNote < midiNote);

        return (
            <KeyboardKey 
                key={noteName}
                baseWidthPercent={whiteKeyWidthPercent}
                isBlack={isBlack}
                isExtra={isExtra}
                onPlayNote={() => handlePlayNote(midiNote)}
                disabled={disabled}
            />
        )
    })

    return (
        <div style={{ display: 'flex', containerType: 'inline-size' }}>
            {keys}
        </div>
    )
}