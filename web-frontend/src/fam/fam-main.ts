let audioContext: AudioContext | null = null;
let synthNode: AudioWorkletNode | null = null;

async function initializeAudio() {
    if (audioContext) return;

    audioContext = new AudioContext();

    const processorUrl = new URL('./fam-audio-processor.ts', import.meta.url).href;
    await audioContext.audioWorklet.addModule(processorUrl);

    synthNode = new AudioWorkletNode(audioContext, 'fam-audio-processor', {
        outputChannelCount: [2]
    });

    synthNode.connect(audioContext.destination);
}

// Simple HTML UI binding injection for verification
document.getElementById('synth-root')!.innerHTML = `
  <div style="font-family: sans-serif; padding: 20px;">
    <h2>Synthesizer Sandbox Layer</h2>
    <p>Status: Audio Thread Dormant</p>
    <button id="start-audio-btn" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
      Activate Audio Thread
    </button>
  </div>
`;

document.getElementById('start-audio-btn')?.addEventListener('click', async () => {
  await initializeAudio();
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  document.querySelector('p')!.innerText = "Status: 🟢 Running (Playing pulse channel)";
});