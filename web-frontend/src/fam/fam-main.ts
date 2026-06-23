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

// 1. Hook up the Volume Slider
document.getElementById('pulse1-vol')?.addEventListener('input', (e) => {
  const volume = parseInt((e.target as HTMLInputElement).value);
  
  // Register 0x4000: 
  // Base config is 0x30 (Disable length counter halt, constant volume mode active)
  // We shift our duty cycle into the top 2 bits, and add our 4-bit volume to the bottom
  const currentDuty = lastSelectedDuty; // Keep track of this in a local variable
  const regValue = currentDuty | 0x30 | volume;

  synthNode?.port.postMessage({ type: 'REG_WRITE', address: 0x4000, value: regValue });
});

// 2. Hook up the Duty Cycle Buttons
let lastSelectedDuty = 0x80; // Default to 50%
function setDuty(dutyValue: number) {
  lastSelectedDuty = dutyValue;
  const currentVolume = parseInt((document.getElementById('pulse1-vol') as HTMLInputElement).value);
  const regValue = dutyValue | 0x30 | currentVolume;

  synthNode?.port.postMessage({ type: 'REG_WRITE', address: 0x4000, value: regValue });
}
// Expose to window scope if needed for the inline onclick attributes
(window as any).setDuty = setDuty;