/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-expect-error - emscripten output, not tracked in git (run make.bat/make.sh to generate)
import FamInterfaceFactory from '../wasm/fam-interface/fam-interface.js';

// Polyfill global scope for Emscripten's auto-location sniffing
const globalScope = typeof globalThis !== 'undefined' ? globalThis : {};
if (typeof (globalScope as any).self === 'undefined') {
  (globalScope as any).self = {
    location: { href: '' }
  };
}

class FamAudioProcessor extends AudioWorkletProcessor {
    private wasmModule: any = null;
    private bufferPtr: number = 0;
    private bufferView: Float32Array | null = null;
    private isReady = false;
    private isDisposed = false;

    constructor() {
        super();
        this.initEngine();

        this.port.onmessage = (event) => {
            const { type, address, value } = event.data;

            if (type === 'DISPOSE') {
                this.dispose();
                return;
            }

            if (!this.isReady) return;

            if (type === 'REG_WRITE') {
                this.wasmModule._writeRegister(address, value);
            }
        }
    }

    async initEngine() {
        this.wasmModule = await FamInterfaceFactory();
        if (this.isDisposed) return; // Disposed while loading

        this.wasmModule._init(sampleRate);

        this.bufferPtr = this.wasmModule._malloc(128 * 4); // Buffer size is always 128
        this.bufferView = new Float32Array(this.wasmModule.HEAPF32.buffer, this.bufferPtr, 128);

        this.isReady = true;
    }

    dispose() {
        this.isDisposed = true;
        if (!this.isReady) return;

        this.isReady = false;
        this.wasmModule._free(this.bufferPtr);
        this.wasmModule._shutdown();
        this.bufferView = null;
        this.wasmModule = null;
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], param: Record<string, Float32Array>): boolean {
        // Returning false tells the browser this node is finished, so only do it after disposal
        if (this.isDisposed) return false;
        if (!this.isReady || this.bufferView == null) return true;

        const output = outputs[0]; // TODO: User picks output device?
        const channelLeft = output[0];
        const channelRight = output[1];
        const bufferSize = channelLeft.length; // 128

        this.wasmModule._renderAudio(this.bufferPtr, bufferSize);

        channelLeft.set(this.bufferView);
        channelRight.set(this.bufferView);

        return true;
    }
}

registerProcessor('fam-audio-processor', FamAudioProcessor);