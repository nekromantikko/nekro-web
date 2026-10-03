#include <emscripten/emscripten.h>
#include <fam/fam.h>

static void* g_apuMemory = nullptr;
static FamApu* g_apu = nullptr;

extern "C" {
    EMSCRIPTEN_KEEPALIVE void init(float sampleRate) {
        size_t apuMemorySize = fam_apu_get_memory_required();
        g_apuMemory = malloc(apuMemorySize);
        fam_apu_init(&g_apu, g_apuMemory, FAM_REGION_NTSC, sampleRate);
    }

    EMSCRIPTEN_KEEPALIVE void shutdown() {
        if (g_apu != nullptr) {
            fam_apu_shutdown(g_apu);
            g_apu = nullptr;
        }
        free(g_apuMemory);
        g_apuMemory = nullptr;
    }

    EMSCRIPTEN_KEEPALIVE void writeRegister(uint16_t address, uint8_t value) {
        if (g_apu != nullptr) {
            fam_apu_write_register(g_apu, address, value);
        }
    }

    EMSCRIPTEN_KEEPALIVE void renderAudio(float* outputBuffer, int numSamples) {
        int cycles = fam_apu_get_cycles_for_samples(g_apu, numSamples);
        fam_apu_run(g_apu, cycles, outputBuffer);
    }
}