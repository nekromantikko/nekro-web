import React, { memo, useId } from 'react';

type MidiSelectorProps = {
    selectedDeviceId: string,
    setSelectedDeviceId: (id: string) => void,
    devices: MIDIInput[]
};

export const MidiDeviceSelector = memo(({
        selectedDeviceId,
        setSelectedDeviceId,
        devices,
    }: MidiSelectorProps) => {
    const selectId = useId();

    return (
        <div className="m-2 flex gap-6">
            <div className="flex items-center gap-4">
                
                <label 
                    htmlFor={selectId} 
                    className="text-s font-medium tracking-wide text-neutral-400 select-none"
                >
                    Active MIDI device
                </label>
                
                <select
                    id={selectId}
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className="
                        cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 
                        px-3 py-1 text-sm font-medium text-neutral-200 shadow-sm
                        transition-colors duration-150 ease-out
                        hover:bg-neutral-800 hover:border-neutral-700
                        focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50
                    "
                >
                <option key="none" value="" className="bg-neutral-900 text-neutral-200">
                    None
                </option>
                
                {devices.map((input) => (
                    <option 
                        key={input.id} 
                        value={input.id} 
                        className="bg-neutral-900 text-neutral-200"
                    >
                        {input.name}
                    </option>
                ))}
                </select>

            </div>
        </div>
    );
});

MidiDeviceSelector.displayName = 'MidiDeviceSelector';