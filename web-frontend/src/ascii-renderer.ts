// @ts-ignore - emscripten output, not tracked in git (run make.bat/make.sh to generate)
import asciiRendererFactory from './wasm/ascii-renderer.js';
import wasmUrl from './wasm/ascii-renderer.wasm?url';
import logoUrl from './obj/logo.obj?url';

import { OBJLoader } from '@loaders.gl/obj';
import { load } from '@loaders.gl/core';

export async function startRenderer(outputEl: HTMLElement): Promise<() => void> {
    const wasmModule = await asciiRendererFactory({ locateFile: () => wasmUrl });

    const initFunc = wasmModule.cwrap('init', null, ['number', 'number', 'number', 'array', 'array']);
    const deinitFunc = wasmModule.cwrap('deinit', null);
    const updateFunc = wasmModule.cwrap('update', 'string', ['number']);

    const data = await load(logoUrl, OBJLoader);

    const vertexCount: number = data.header?.vertexCount ?? 0;
    const normals = data.attributes.NORMAL.value as Float32Array;
    const positions = data.attributes.POSITION.value as Float32Array;

    const normalsU8 = new Uint8Array(normals.buffer);
    const positionsU8 = new Uint8Array(positions.buffer);

    initFunc(45, 25, vertexCount, positionsU8, normalsU8);

    let rafId: number;

    const animate = (time: number) => {
        outputEl.textContent = updateFunc(time);
        rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(rafId);
        deinitFunc();
    };
}
