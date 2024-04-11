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
    {-1,-1,-1}, // 0
    {-1,-1,1}, // 1
    {1,-1,1}, // 2
    {1,-1,-1}, // 3
    {-1,1,-1}, // 4
    {1,1,-1}, // 5
    {1,1,1}, // 6
    {-1,1,1}, // 7
    {-1,-1,1},
    {-1,1,1},
    {1,1,1},
    {1,-1,1},
    {1,1,-1}, // 5
    {-1,1,-1}, // 4
    {-1,-1,-1}, // 0
    {1,-1,-1}, // 3
    {1,1,1}, // 6
    {1,1,-1}, // 5
    {1,-1,-1}, // 3
    {1,-1,1}, // 2
    {-1,1,-1}, // 4
    {-1,1,1}, // 7
    {-1,-1,1}, // 1
    {-1,-1,-1}, // 0
};

glm::vec3 cubeNormals[] = {
    {0,-1,0},
    {0,-1,0},
    {0,-1,0},
    {0,-1,0},
    {0,1,0},
    {0,1,0},
    {0,1,0},
    {0,1,0},
    {0,0,1},
    {0,0,1},
    {0,0,1},
    {0,0,1},
    {0,0,-1},
    {0,0,-1},
    {0,0,-1},
    {0,0,-1},
    {1,0,0},
    {1,0,0},
    {1,0,0},
    {1,0,0},
    {-1,0,0},
    {-1,0,0},
    {-1,0,0},
    {-1,0,0},
};

int vertCount = 24;

int edges[] = { 0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 1, 5, 2, 6, 3, 7, 4, 5, 5, 6, 6, 7, 7, 4 };

glm::ivec3 tris[] = {
    {0,1,2},
    {0,2,3},
    {4,5,6},
    {4,6,7},
    {8,9,10},
    {8,10,11},
    {12,13,14},
    {12,14,15},
    {16,17,18},
    {16,18,19},
    {20,21,22},
    {20,22,23}
};

int triCount = 12;

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

glm::ivec2 denormalize(const glm::vec2 &p) {
    return glm::ivec2(floor(p.x * widthChr), floor(p.y * heightChr));
}

glm::vec2 normalize(const glm::ivec2 &pChr) {
    return glm::vec2((float)pChr.x / widthChr, (float)pChr.y / heightChr);
}

// Pineda edge function
float edgeFunc(const glm::vec2 &a, const glm::vec2 &b, const glm::vec2 &c) {
    return (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);
}

void drawTriangleNaive(const glm::vec2 &v0, const glm::vec2 &v1, const glm::vec2 &v2, const glm::vec3 &n0, const glm::vec3 &n1, const glm::vec3 &n2) {
    float area = edgeFunc(v0,v1,v2);

    for (int i = 0; i < bufferLength; i++) {
        glm::ivec2 pChr(i % widthChr, i / widthChr);
        glm::vec2 p = normalize(pChr);

        float w0 = edgeFunc(v0,v1,p);
        float w1 = edgeFunc(v1,v2,p);
        float w2 = edgeFunc(v2,v0,p);

        bool pointInsideTriangle = w0 >= 0 && w1 >= 0 && w2 >= 0;

        if (pointInsideTriangle) {
            // Normalize barycentric coordinates
            w0 /= area;
            w1 /= area;
            w2 /= area;

            glm::vec3 normal = w0*n0+w1*n1+w2*n2;
            glm::vec3 lightDir = glm::normalize(glm::vec3(1,1,1));

            float brightness = glm::clamp(glm::dot(normal, lightDir), 0.0f, 1.0f);
            brightness *= 0.9f;
            brightness += 0.1f;

            buffer[i] = getCharFromBrightness(brightness);
        }
    }
}

void drawLine(const glm::vec2 &p0, const glm::vec2 &p1, float value = 1.0f) {
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

        clearBuffer(0.0f);

        glm::mat4 cameraTransformMat(1.0f);
        cameraTransformMat = glm::translate(cameraTransformMat, glm::vec3(0,0,7.5f));
        glm::mat4 viewMat = glm::inverse(cameraTransformMat);
        glm::mat4 perspMat = glm::perspective(glm::radians(fov), aspect, nearClip, farClip);

        glm::mat4 modelMat(1.0f);
        float angle = time * 0.0005;
        modelMat = glm::rotate(modelMat, angle, glm::vec3(1,0,0));
        modelMat = glm::rotate(modelMat, angle*2, glm::vec3(0,1,0));
        modelMat = glm::rotate(modelMat, angle*3, glm::vec3(0,0,1));

        glm::mat4 normalMat = glm::transpose(glm::inverse(modelMat));

        glm::vec2 transformedPts[vertCount];
        glm::vec3 transformedNrm[vertCount];
        for (int i = 0; i < vertCount; i++) {
            glm::vec4 clipPos = perspMat * viewMat * modelMat * glm::vec4(cubeVerts[i], 1.0f);
            clipPos /= clipPos.w;
            // Normalize
            float x = clipPos.x * 0.5f + 0.5f;
            float y = clipPos.y * 0.5f + 0.5f;

            transformedPts[i] = glm::vec2(x,y);

            glm::vec4 transNorm = normalMat * glm::vec4(cubeNormals[i], 0.0f);
            transformedNrm[i] = glm::vec3(transNorm.x,transNorm.y,transNorm.z);
        }

        // for (int i = 0; i < 24; i += 2) {
        //     int p0Ind = edges[i];
        //     int p1Ind = edges[i+1];
        //     drawLine(transformedPts[p0Ind], transformedPts[p1Ind], 0.25f);
        // }

        // for (int i = 0; i < 8; i++) {
        //     drawPoint(transformedPts[i]);
        // }

        for (int i = 0; i < triCount; i++) {
            int p0Ind = tris[i].x;
            int p1Ind = tris[i].y;
            int p2Ind = tris[i].z;

            drawTriangleNaive(transformedPts[p0Ind], transformedPts[p1Ind], transformedPts[p2Ind], transformedNrm[p0Ind], transformedNrm[p1Ind], transformedNrm[p2Ind]);
        }
        
        return buffer;
    }
}