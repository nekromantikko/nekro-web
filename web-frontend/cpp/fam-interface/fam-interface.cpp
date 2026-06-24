#include <emscripten/emscripten.h>

extern "C" {
    #include <fam/apu.h>
}

static float g_sampleRate = 44100.f;
static FamApu* g_apu = nullptr;

extern "C" {
    EMSCRIPTEN_KEEPALIVE void init(float sampleRate) {
        g_sampleRate = sampleRate;

        fam_apu_init(&g_apu);
    }

    EMSCRIPTEN_KEEPALIVE void writeRegister(uint16_t address, uint8_t value) {
        if (g_apu != nullptr) {
            fam_apu_write_register(g_apu, address, value);
        }
    }

    EMSCRIPTEN_KEEPALIVE void renderAudio(float* outputBuffer, int numSamples) {
        const double apuPeriod = 1.0 / fam_apu_get_freq(g_apu);
        const double sampleTime = 1.0 / (double)g_sampleRate;

        static double accumulator = 0;

        for (int i = 0; i < numSamples; i++) {
            accumulator += sampleTime;
            while (accumulator >= apuPeriod) {
                fam_apu_clock(g_apu);
                accumulator -= apuPeriod;
            }

            fam_apu_get_sample(g_apu, &outputBuffer[i]);
        }
    }
}