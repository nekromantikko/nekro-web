#include <cstdlib>
#include <cstring>
#include <cmath>
#include <algorithm>
#include <emscripten/emscripten.h>

#define GLM_FORCE_RADIANS
#define GLM_FORCE_DEPTH_ZERO_TO_ONE
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

EM_JS(void, consoleLog_internal, (const char* msg), {
    console.log(UTF8ToString(msg));
});

void consoleLog(const char* fmt, ...) {
    char s[1025];
    va_list args;
    va_start(args, fmt);
    vsprintf(s, fmt, args);
    va_end(args);
    consoleLog_internal(s);
}

const char* asciiCharsByBrightness = ".-:|/]o8#";

char* buffer = nullptr;
int widthChr = 0;
int heightChr = 0;
int bufferLength = 0;

// Temp
glm::vec3 cubeVerts[] = {
    {-1,-1,-1},
    {1,-1,-1},
    {1,-1,1},
    {-1,-1,1},
    {-1,1,-1},
    {1,1,-1},
    {1,1,1},
    {-1,1,1}
};

int edges[] = { 0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 1, 5, 2, 6, 3, 7, 4, 5, 5, 6, 6, 7, 7, 4 };

float aspect = 1.0f;
float fov = 35.0f;
float nearClip = 0.01f;
float farClip = 100.0f;

int getCharFromBrightness(float value) {
    const int strLength = 8; // NOTE: Hardcoded string length!
    int ind = (int)round(value * strLength);
    return asciiCharsByBrightness[ind];
}

void clearBuffer(float value) {
    const char chr = getCharFromBrightness(value);
    memset(buffer, chr, bufferLength);
}

void drawLineVertical(int xChr, int y0Chr, int y1Chr, float value = 1.0f) {
    int startInd = y0Chr * widthChr + xChr;
    int endInd = y1Chr * widthChr + xChr;

    for (int i = startInd; i < endInd && i < bufferLength; i += widthChr) {
        buffer[i] = getCharFromBrightness(value);
    }
}

void drawLineHorizontal(int yChr, int x0Chr, int x1Chr, float value = 1.0f) {
    int startInd = yChr * widthChr + x0Chr;
    int endInd = yChr * widthChr + x1Chr;

    for (int i = startInd; i < endInd && i < bufferLength; i++) {
        buffer[i] = getCharFromBrightness(value);
    }
}

void bresenham(glm::ivec2 p0, glm::ivec2 p1, float value = 1.0f) {
    int dx = p1.x - p0.x;
    int dy = p1.y - p0.y;
    int dir = 1;
    if (dy < 0) {
        dir = -1;
        dy *= -1;
    }

    int err = 2 * dy - dx;

    for (int x = p0.x, y = p0.y; x < p1.x; x++) {
        int ind = y * widthChr + x;
        buffer[ind] = getCharFromBrightness(value);

        if (err > 0) {
            y += dir;
            err += 2 * (dy - dx);
        } else {
            err += 2 * dy;
        }
    }
}

void bresenhamSteep(glm::ivec2 p0, glm::ivec2 p1, float value = 1.0f) {
    int dx = p1.x - p0.x;
    int dy = p1.y - p0.y;
    int dir = 1;
    if (dx < 0) {
        dir = -1;
        dx *= -1;
    }

    int err = 2 * dx - dy;

    for (int x = p0.x, y = p0.y; y < p1.y; y++) {
        int ind = y * widthChr + x;
        buffer[ind] = getCharFromBrightness(value);

        if (err > 0) {
            x += dir;
            err += 2 * (dx - dy);
        } else {
            err += 2 * dx;
        }
    }
}

glm::ivec2 denormalize(glm::vec2 p) {
    return glm::ivec2(floor(p.x * widthChr), floor(p.y * heightChr));
}

void drawLine(glm::vec2 p0, glm::vec2 p1, float value = 1.0f) {
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

void drawPoint(glm::vec2 p, float value = 1.0f) {
    auto pChr = denormalize(p);

    int ind = pChr.y * widthChr + pChr.x;
    buffer[ind] = getCharFromBrightness(value);
}

extern "C" {
    EMSCRIPTEN_KEEPALIVE void init(int width, int height) {
        widthChr = width;
        heightChr = height;
        bufferLength = width*height;
        buffer = (char*)calloc(bufferLength+1, sizeof(char));
    }

    EMSCRIPTEN_KEEPALIVE void deinit() {
        free(buffer);
    }

    EMSCRIPTEN_KEEPALIVE char* update(float time) {
        if (buffer == nullptr || bufferLength == 0)
            return nullptr;

        // float xOrigin = 0.5f + cos(time)*0.5f;
        // float yOrigin = 0.5f + sin(time)*0.5f;

        // for (int i = 0; i < bufferLength; i++) {
        //     int x = i % widthChr;
        //     int y = i / widthChr;

        //     float u = ((float)x + 0.5f) / widthChr;
        //     float v = ((float)y + 0.5f) / heightChr;

        //     float xDist = u - xOrigin;
        //     float yDist = v - yOrigin;
        //     float dist = sqrt(xDist*xDist + yDist*yDist);

        //     float brightness = std::clamp(dist, 0.0f, 1.0f);

        //     buffer[i] = getCharFromBrightness(brightness);
        // }
        clearBuffer(0.0f);

        glm::mat4 cameraTransformMat(1.0f);
        cameraTransformMat = glm::translate(cameraTransformMat, glm::vec3(0,0,7.5f));
        glm::mat4 viewMat = glm::inverse(cameraTransformMat);
        glm::mat4 perspMat = glm::perspective(glm::radians(fov), aspect, nearClip, farClip);

        glm::mat4 modelMat(1.0f);
        modelMat = glm::rotate(modelMat, time, glm::vec3(1,1,1));

        // float x = (sin(time) + 1.0f) / 2;
        // drawLineVertical(x, 0.25f, 0.75f);
        // drawLineHorizontal(x, 0.25f, 0.75f);

        glm::vec2 transformedPts[8];
        for (int i = 0; i < 8; i++) {
            glm::vec4 clipPos = perspMat * viewMat * modelMat * glm::vec4(cubeVerts[i], 1.0f);
            clipPos /= clipPos.w;
            // Normalize
            float x = clipPos.x * 0.5f + 0.5f;
            float y = clipPos.y * 0.5f + 0.5f;

            transformedPts[i] = glm::vec2(x,y);
            // drawPoint(transformedPts[i]);
        }

        for (int i = 0; i < 24; i += 2) {
            int p0Ind = edges[i];
            int p1Ind = edges[i+1];
            drawLine(transformedPts[p0Ind], transformedPts[p1Ind], 0.25f);
        }

        for (int i = 0; i < 8; i++) {
            drawPoint(transformedPts[i]);
        }
        
        return buffer;
    }
}