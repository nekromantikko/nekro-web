#include <cstdlib>
#include <cstring>
#include <emscripten/emscripten.h>

#define GLM_FORCE_RADIANS
#define GLM_FORCE_DEPTH_ZERO_TO_ONE
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

constexpr int BRIGHTNESS_LEVEL_COUNT = 9;
constexpr char asciiCharsByBrightness[BRIGHTNESS_LEVEL_COUNT] = {'.', '-', ':', '|', '/', ']', 'o', '8', '#'};

struct State {
    char* buffer = nullptr;
    float* zbuffer = nullptr;
    int width = 0;
    int height = 0;
    int bufferLength = 0;

    int vertexCount = 0;
    glm::vec3* positions = nullptr;
    glm::vec3* normals = nullptr;
    glm::vec3* transformedPts = nullptr;
    glm::vec3* transformedNrm = nullptr;

    float aspect = 1.0f;
    float fov = 35.0f;
    float nearClip = 0.01f;
    float farClip = 100.0f;

    glm::vec3 lightDir = glm::vec3(0.0f, 0.0f, 1.0f);
};

static State state;

static char getCharFromBrightness(float value) {
    int ind = (int)glm::round(value * (BRIGHTNESS_LEVEL_COUNT - 1));
    return asciiCharsByBrightness[ind];
}

static float remap(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

static void clearBuffer(float value, float z) {
    const char chr = getCharFromBrightness(value);
    memset(state.buffer, chr, state.bufferLength);

    for (int i = 0; i < state.bufferLength; i++) {
        state.zbuffer[i] = z;
    }
}

static void drawLineVertical(int xChr, int y0Chr, int y1Chr, float value = 1.0f) {
    int startInd = y0Chr * state.width + xChr;
    int endInd = y1Chr * state.width + xChr;

    for (int i = startInd; i < endInd && i < state.bufferLength; i += state.width) {
        state.buffer[i] = getCharFromBrightness(value);
    }
}

static void drawLineHorizontal(int yChr, int x0Chr, int x1Chr, float value = 1.0f) {
    int startInd = yChr * state.width + x0Chr;
    int endInd = yChr * state.width + x1Chr;

    for (int i = startInd; i < endInd && i < state.bufferLength; i++) {
        state.buffer[i] = getCharFromBrightness(value);
    }
}

static void bresenham(glm::ivec2 p0, glm::ivec2 p1, float value = 1.0f) {
    int dx = p1.x - p0.x;
    int dy = p1.y - p0.y;
    int dir = 1;
    if (dy < 0) {
        dir = -1;
        dy *= -1;
    }

    int err = 2 * dy - dx;

    for (int x = p0.x, y = p0.y; x < p1.x; x++) {
        int ind = y * state.width + x;
        state.buffer[ind] = getCharFromBrightness(value);

        if (err > 0) {
            y += dir;
            err += 2 * (dy - dx);
        } else {
            err += 2 * dy;
        }
    }
}

static void bresenhamSteep(glm::ivec2 p0, glm::ivec2 p1, float value = 1.0f) {
    int dx = p1.x - p0.x;
    int dy = p1.y - p0.y;
    int dir = 1;
    if (dx < 0) {
        dir = -1;
        dx *= -1;
    }

    int err = 2 * dx - dy;

    for (int x = p0.x, y = p0.y; y < p1.y; y++) {
        int ind = y * state.width + x;
        state.buffer[ind] = getCharFromBrightness(value);

        if (err > 0) {
            x += dir;
            err += 2 * (dx - dy);
        } else {
            err += 2 * dx;
        }
    }
}

static glm::ivec2 denormalize(const glm::vec2 &p) {
    return glm::ivec2(glm::round(p.x * state.width), glm::round(p.y * state.height));
}

static glm::vec2 normalize(const glm::ivec2 &pChr) {
    return glm::vec2((float)pChr.x / state.width, (float)pChr.y / state.height);
}

// Pineda edge function
static float edgeFunc(const glm::vec2 &a, const glm::vec2 &b, const glm::vec2 &c) {
    return (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);
}

static void drawTriangle(const glm::vec3 &v0, const glm::vec3 &v1, const glm::vec3 &v2, const glm::vec3 &n0, const glm::vec3 &n1, const glm::vec3 &n2, const glm::vec3 &lightDir) {
    float area = edgeFunc(v0, v1, v2);

    glm::ivec2 v0Chr = denormalize(v0);
    glm::ivec2 v1Chr = denormalize(v1);
    glm::ivec2 v2Chr = denormalize(v2);

    glm::ivec2 minCoord(glm::min(glm::min(v0Chr.x, v1Chr.x), v2Chr.x), glm::min(glm::min(v0Chr.y, v1Chr.y), v2Chr.y));
    glm::ivec2 maxCoord(glm::max(glm::max(v0Chr.x, v1Chr.x), v2Chr.x), glm::max(glm::max(v0Chr.y, v1Chr.y), v2Chr.y));

    const float xStep = normalize(glm::ivec2(1, 1)).x;

    for (int y = minCoord.y; y <= maxCoord.y; y++) {
        int x = minCoord.x;
        glm::ivec2 pChr(x, y);
        glm::vec2 p = normalize(pChr);

        const float w0Step = (v1.y - v0.y) * xStep;
        const float w1Step = (v2.y - v1.y) * xStep;
        const float w2Step = (v0.y - v2.y) * xStep;

        float w0 = edgeFunc(glm::vec2(v0), glm::vec2(v1), p);
        float w1 = edgeFunc(glm::vec2(v1), glm::vec2(v2), p);
        float w2 = edgeFunc(glm::vec2(v2), glm::vec2(v0), p);

        int i = y * state.width + x;

        for (; x <= maxCoord.x; x++, w0 += w0Step, w1 += w1Step, w2 += w2Step, i++) {
            bool pointInsideTriangle = w0 >= 0 && w1 >= 0 && w2 >= 0;

            if (pointInsideTriangle) {
                glm::vec3 normal = (w0 * n0 + w1 * n1 + w2 * n2) / area;
                float depth = (w0 * v0.z + w1 * v1.z + w2 * v2.z) / area;
                depth = remap(depth, state.nearClip, state.farClip, 0.0f, 1.0f);

                if (depth >= state.zbuffer[i]) {
                    continue;
                }

                if (normal.z <= 0) {
                    continue;
                }

                float brightness = glm::clamp(glm::dot(normal, lightDir), 0.0f, 1.0f);
                brightness = remap(brightness, 0.0f, 1.0f, 0.1f, 1.0f);

                state.buffer[i] = getCharFromBrightness(brightness);
                state.zbuffer[i] = depth;
            }
        }
    }
}

static void drawLine(const glm::vec2 &p0, const glm::vec2 &p1, float value = 1.0f) {
    auto p0Chr = denormalize(p0);
    auto p1Chr = denormalize(p1);

    if (p0Chr.x == p1Chr.x) {
        if (p0Chr.y < p1Chr.y) {
            drawLineVertical(p0Chr.x, p0Chr.y, p1Chr.y, value);
        } else {
            drawLineVertical(p0Chr.x, p1Chr.y, p0Chr.y, value);
        }
        return;
    }

    if (p0Chr.y == p1Chr.y) {
        if (p0Chr.x < p1Chr.x) {
            drawLineHorizontal(p0Chr.y, p0Chr.x, p1Chr.x, value);
        } else {
            drawLineHorizontal(p0Chr.y, p1Chr.x, p0Chr.x, value);
        }
        return;
    }

    if (abs(p1Chr.y - p0Chr.y) < abs(p1Chr.x - p0Chr.x)) {
        if (p0Chr.x < p1Chr.x) {
            bresenham(p0Chr, p1Chr, value);
        } else {
            bresenham(p1Chr, p0Chr, value);
        }
        return;
    }

    if (p0Chr.y < p1Chr.y) {
        bresenhamSteep(p0Chr, p1Chr, value);
    } else {
        bresenhamSteep(p1Chr, p0Chr, value);
    }
}

static void drawPoint(glm::vec2 p, float value = 1.0f) {
    auto pChr = denormalize(p);

    int ind = pChr.y * state.width + pChr.x;
    state.buffer[ind] = getCharFromBrightness(value);
}

extern "C" {
    EMSCRIPTEN_KEEPALIVE char* init(int width, int height, int verts, glm::vec3* pos, glm::vec3* norm) {
        state.width = width;
        state.height = height;
        state.bufferLength = width * height;
        state.buffer = (char*)calloc(state.bufferLength + 1, sizeof(char));
        state.zbuffer = (float*)calloc(state.bufferLength, sizeof(float));

        state.vertexCount = verts;
        state.positions = pos;
        state.normals = norm;

        state.transformedPts = (glm::vec3*)calloc(verts, sizeof(glm::vec3));
        state.transformedNrm = (glm::vec3*)calloc(verts, sizeof(glm::vec3));

        state.lightDir = glm::normalize(glm::vec3(0.0f, 0.0f, 1.0f));

        return state.buffer;
    }

    EMSCRIPTEN_KEEPALIVE void deinit() {
        free(state.buffer);
        free(state.zbuffer);
        free(state.transformedPts);
        free(state.transformedNrm);
    }

    EMSCRIPTEN_KEEPALIVE void update(float time) {
        if (state.buffer == nullptr || state.bufferLength == 0)
            return;

        clearBuffer(0.0f, 1.0f);

        glm::mat4 cameraTransformMat(1.0f);
        cameraTransformMat = glm::translate(cameraTransformMat, glm::vec3(0, 0, 5.0f));
        glm::mat4 viewMat = glm::inverse(cameraTransformMat);
        glm::mat4 perspMat = glm::perspective(glm::radians(state.fov), state.aspect, state.nearClip, state.farClip);
        perspMat[1][1] *= -1;

        glm::mat4 modelMat(1.0f);
        float angle = time * 0.0005f;
        modelMat = glm::rotate(modelMat, angle * 2, glm::vec3(1, 0, 0));
        modelMat = glm::rotate(modelMat, angle * 2, glm::vec3(0, -1, 0));

        glm::mat4 normalMat = glm::transpose(glm::inverse(modelMat));

        for (int i = 0; i < state.vertexCount; i++) {
            glm::vec4 clipPos = perspMat * viewMat * modelMat * glm::vec4(state.positions[i], 1.0f);
            clipPos /= clipPos.w;
            float x = remap(clipPos.x, -1.0f, 1.0f, 0.0f, 1.0f);
            float y = remap(clipPos.y, -1.0f, 1.0f, 0.0f, 1.0f);
            state.transformedPts[i] = glm::vec3(x, y, clipPos.z);

            glm::vec4 transNorm = normalMat * glm::vec4(state.normals[i], 0.0f);
            state.transformedNrm[i] = glm::vec3(transNorm);
        }

        for (int i = 0; i < state.vertexCount; i += 3) {
            drawTriangle(
                state.transformedPts[i], state.transformedPts[i+1], state.transformedPts[i+2],
                state.transformedNrm[i], state.transformedNrm[i+1], state.transformedNrm[i+2],
                state.lightDir
            );
        }
    }
}
