// @ts-expect-error - emscripten output, not tracked in git (run make.bat/make.sh to generate)
import AsciiRendererFactory from '../wasm/ascii-renderer/ascii-renderer.js';
import logoUrl from './obj/logo.obj?url';

import { OBJLoader } from '@loaders.gl/obj';
import { load } from '@loaders.gl/core';

export async function startRenderer(outputEl: HTMLElement): Promise<() => void> {
    const wasmModule = await AsciiRendererFactory();

    const data = await load(logoUrl, OBJLoader);

    const vertexCount: number = data.header?.vertexCount ?? 0;
    const positions = data.attributes.POSITION.value as Float32Array;
    const normals = data.attributes.NORMAL.value as Float32Array;

    const posPtr = wasmModule._malloc(positions.byteLength);
    const nrmPtr = wasmModule._malloc(normals.byteLength);

    new Float32Array(wasmModule.HEAPU8.buffer, posPtr, positions.length).set(positions);
    new Float32Array(wasmModule.HEAPU8.buffer, nrmPtr, normals.length).set(normals);

    const width = 45;
    const height = 25;
    const bufferSize = width * height;
    const bufferPtr = wasmModule._init(width, height, vertexCount, posPtr, nrmPtr);
    const frameBufferView = new Uint8Array(wasmModule.HEAPU8.buffer, bufferPtr, bufferSize);
    const decoder = new TextDecoder('utf-8');

    let rafId: number;

    const animate = (time: number) => {
        wasmModule._update(time);
        outputEl.textContent = decoder.decode(frameBufferView);
        rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(rafId);
        wasmModule._deinit();
    };
}
