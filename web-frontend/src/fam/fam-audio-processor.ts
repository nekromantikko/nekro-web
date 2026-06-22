import FamInterfaceFactory from '../wasm/fam-interface/fam-interface.js';

class FamAudioProcessor extends AudioWorkletProcessor {
    private wasmModule: any = null;
    private bufferPtr: number = 0;
    private bufferView: Float32Array | null = null;

    constructor() {
        super();
        this.initEngine();

        this.port.onmessage = (event) => {
            // TODO: Register UI events
        }
    }

    async initEngine() {
        this.wasmModule = await FamInterfaceFactory();
        this.wasmModule._init(sampleRate);

        this.bufferPtr = this.wasmModule._malloc(128 * 4); // Buffer size is always 128
        this.bufferView = new Float32Array(this.wasmModule.HEAPF32.buffer, this.bufferPtr, 128);
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], param: Record<string, Float32Array>): boolean {
        if (this.bufferView == null) return false;

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