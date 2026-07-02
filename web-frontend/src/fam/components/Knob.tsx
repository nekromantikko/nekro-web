import React, { memo, useMemo, useRef, useState } from 'react';
import { Label } from './Label';

type KnobProps = {
    value?: number,
    steps?: number,
    min?: number,
    max?: number,
    label?: string,
    onChange?: (value: number) => void
};

type KnobDragState = {
    dragging: boolean,
    startY: number,
    startValue: number,
    currentY: number
};

const dragSensitivity = 0.01;

const normalize = (val: number, min: number, max: number) => {
    return (val - min) / (max - min);
}

const denormalize = (norm: number, min: number, max: number) => {
    return min + (norm * (max - min));
}

export const Knob = memo(({ value = 0, steps = 11, min = -1, max = 1, label = '', onChange }: KnobProps) => {
    const normalized = normalize(value, min, max);
    const totalSweep = 270;
    const startAngle = 45;

    const angle = startAngle + (normalized * totalSweep);

    const [dragState, setDragState] = useState<KnobDragState>({ dragging: false, startY: 0, startValue: 0, currentY: 0});
    const ref = useRef<HTMLDivElement>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.button !== 0 || e.target != ref.current) return;

        ref.current.setPointerCapture(e.pointerId);

        setDragState({
            dragging: true,
            startY: e.screenY,
            startValue: normalized,
            currentY: e.screenY
        });
        e.stopPropagation();
        e.preventDefault();
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (e.button !== 0 || e.target != ref.current) return;

        try {
            ref.current.releasePointerCapture(e.pointerId);
        } catch {
            //
        }

        setDragState({
            dragging: false,
            startY: 0,
            startValue: 0,
            currentY: 0
        });
        e.stopPropagation();
        e.preventDefault();
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragState.dragging) return;

        const delta = e.screenY - dragState.startY;
        const newNormalizedValue = Math.min(Math.max(dragState.startValue - (delta * dragSensitivity), 0.0), 1.0);
        const newValue = denormalize(newNormalizedValue, min, max);
        if (onChange) onChange(newValue);

        setDragState(prev => ({ ...prev, currentY: e.screenY }));
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const circleSegment = useMemo(() => {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const arcLength = circumference * (totalSweep / 360);
        const gapLength = circumference * ((360 - totalSweep) / 360);

        return (
            <svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full pointer-events-none touch-none"
                style={{ transform: `rotate(${startAngle + 90}deg)`  }}
            >
                <circle
                    cx="50"
                    cy="50"
                    r={`${radius}`}
                    fill="none"
                    className="stroke-olive-300 stroke-2"
                    strokeDasharray={`${arcLength} ${gapLength}`}
                    strokeLinecap="round"
                />
            </svg>
        );
    }, [startAngle, totalSweep]);

    const notches = useMemo(() => {
        const stepsArray = Array.from({ length: steps });

        return (
            <svg className="absolute inset-0 w-full h-full rotate-180 pointer-events-none touch-none">
                {stepsArray.map((_, index) => {
                    const currentStepAngle = startAngle + (index * (totalSweep / (steps - 1)));
                    
                    return (
                        <line
                            key={index}
                            x1="50%" y1="2%"
                            x2="50%" y2="10%"
                            style={{
                                transformOrigin: '50% 50%',
                                transform: `rotate(${currentStepAngle}deg)`,
                            }}
                            className="stroke-olive-300 stroke-2"
                            strokeLinecap="round"
                        />
                    );
                })}
            </svg>
        );
    }, [steps, startAngle, totalSweep]);

    return (
        <div className="relative w-24 h-24 flex items-center justify-center m-2">
            {circleSegment}
            {notches}
            <div 
                ref={ref}
                className="
                    h-16 w-16 
                    rounded-full 
                    bg-[conic-gradient(from_135deg,--theme(--color-mist-900),--theme(--color-mist-800),--theme(--color-mist-700),--theme(--color-mist-800),--theme(--color-mist-900))]
                    shadow-[3px_3px_8px_rgba(0,0,0,0.7),inset_0_0_2px_rgba(0,0,0,0.2)]
                    flex items-center justify-center
                    relative
                    touch-none
                "
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onContextMenu={handleContextMenu}
            >
                <div 
                    className="absolute h-1/2 w-1 bg-olive-300 rounded-t-full pointer-events-none touch-none"
                    style={{ 
                        transformOrigin: 'top', 
                        transform: `translateY(50%) rotate(${angle}deg)` 
                    }}
                />
                <div className="h-10 w-10 rounded-full bg-mist-800 shadow-[inset_0_0_2px_--theme(--color-mist-700)] pointer-events-none touch-none" />
            </div>
            <div className="absolute inset-x-0 bottom-0 translate-y-1/2 flex justify-center">
                <Label size='sm'>{label}</Label>
            </div>
        </div>
    )
});

Knob.displayName = 'Knob';