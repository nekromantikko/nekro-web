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
float* zbuffer = nullptr;
int widthChr = 0;
int heightChr = 0;
int bufferLength = 0;

int vertexCount = 0;
glm::vec3 *positions = nullptr;
glm::vec3 *normals = nullptr;

float aspect = 1.0f;
float fov = 35.0f;
float nearClip = 0.01f;
float farClip = 100.0f;

int getCharFromBrightness(float value) {
    const int strLength = 8; // NOTE: Hardcoded string length!
    int ind = (int)round(value * strLength);
    return asciiCharsByBrightness[ind];
}

float remap(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void clearBuffer(float value, float z) {
    const char chr = getCharFromBrightness(value);
    memset(buffer, chr, bufferLength);

    for (int i = 0; i < bufferLength; i++) {
        zbuffer[i] = z;
    }
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
    return glm::ivec2(round(p.x * widthChr), heightChr - round(p.y * heightChr));
}

glm::vec2 normalize(const glm::ivec2 &pChr) {
    return glm::vec2((float)pChr.x / widthChr, 1.0f - (float)pChr.y / heightChr);
}

// Pineda edge function
float edgeFunc(const glm::vec2 &a, const glm::vec2 &b, const glm::vec2 &c) {
    return (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);
}

void drawTriangleNaive(const glm::vec3 &v0, const glm::vec3 &v1, const glm::vec3 &v2, const glm::vec3 &n0, const glm::vec3 &n1, const glm::vec3 &n2) {
    float area = edgeFunc(v0,v1,v2);

    glm::ivec2 v0Chr = denormalize(v0);
    glm::ivec2 v1Chr = denormalize(v1);
    glm::ivec2 v2Chr = denormalize(v2);

    glm::ivec2 minCoord(std::min(std::min(v0Chr.x, v1Chr.x), v2Chr.x),std::min(std::min(v0Chr.y, v1Chr.y), v2Chr.y));
    glm::ivec2 maxCoord(std::max(std::max(v0Chr.x, v1Chr.x), v2Chr.x),std::max(std::max(v0Chr.y, v1Chr.y), v2Chr.y));
    // consoleLog("drawing triangle (%f,%f), (%f,%f), (%f,%f)", v0.x, v0.y, v1.x, v1.y, v2.x, v2.y);
    // consoleLog("(%d - %d)", startInd, endInd);
    // consoleLog("END");

    const float xStep = normalize(glm::ivec2(1,1)).x;

    for (int y = minCoord.y; y <= maxCoord.y; y++) {
        int x = minCoord.x;
        glm::ivec2 pChr(x,y);
        glm::vec2 p = normalize(pChr);

        const float w0Step = (v1.y - v0.y) * xStep;
        const float w1Step = (v2.y - v1.y) * xStep;
        const float w2Step = (v0.y - v2.y) * xStep;

        float w0 = edgeFunc(glm::vec2(v0),glm::vec2(v1),p);
        float w1 = edgeFunc(glm::vec2(v1),glm::vec2(v2),p);
        float w2 = edgeFunc(glm::vec2(v2),glm::vec2(v0),p);

        int i = y * widthChr + x;

        for (; x <= maxCoord.x; x++, w0+=w0Step, w1+=w1Step, w2+=w2Step, i++) {
            bool pointInsideTriangle = w0 >= 0 && w1 >= 0 && w2 >= 0;

            if (pointInsideTriangle) {
                glm::vec3 normal = w0*n0+w1*n1+w2*n2;
                // Normalize barycentric coordinates
                normal /= area;
                glm::vec3 lightDir = glm::normalize(glm::vec3(0,0,-1));
                float depth = w0*v0.z+w1*v1.z+w2*v2.z;
                depth /= area;
                depth = remap(depth, nearClip, farClip, 0.0f, 1.0f);
                // consoleLog("fragment depth %f, zbuffer value %f", depth, zbuffer[i]);

                if (depth >= zbuffer[i]) {
                    continue;
                }

                // Cull le backface (stupid)
                if (normal.z >= 0) {
                    continue;
                }

                float brightness = glm::clamp(glm::dot(normal, lightDir), 0.0f, 1.0f);
                brightness = remap(brightness, 0.0f, 1.0f, 0.1f, 1.0f);

                buffer[i] = getCharFromBrightness(brightness);
                zbuffer[i] = depth;
            }
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
    EMSCRIPTEN_KEEPALIVE void init(int width, int height, int verts, float* pos, float* norm) {
        widthChr = width;
        heightChr = height;
        bufferLength = width*height;
        buffer = (char*)calloc(bufferLength+1, sizeof(char));
        zbuffer = (float*)calloc(bufferLength, sizeof(float));

        positions = (glm::vec3*)calloc(verts, sizeof(glm::vec3));
        memcpy(positions, pos, sizeof(glm::vec3)*verts);
        normals = (glm::vec3*)calloc(verts, sizeof(glm::vec3));
        memcpy(normals, norm, sizeof(glm::vec3)*verts);
        vertexCount = verts;
    }

    EMSCRIPTEN_KEEPALIVE void deinit() {
        free(buffer);
        free(zbuffer);

        free(positions);
        free(normals);
    }

    EMSCRIPTEN_KEEPALIVE char* update(float time) {
        if (buffer == nullptr || bufferLength == 0)
            return nullptr;

        clearBuffer(0.0f, 1.0f);

        glm::mat4 cameraTransformMat(1.0f);
        cameraTransformMat = glm::translate(cameraTransformMat, glm::vec3(0,0,5.0f));
        glm::mat4 viewMat = glm::inverse(cameraTransformMat);
        glm::mat4 perspMat = glm::perspective(glm::radians(fov), aspect, nearClip, farClip);

        glm::mat4 modelMat(1.0f);
        float angle = time * 0.0005;
        modelMat = glm::rotate(modelMat, angle*2, glm::vec3(1,0,0));
        modelMat = glm::rotate(modelMat, angle*2, glm::vec3(0,-1,0));
        // modelMat = glm::rotate(modelMat, angle*3, glm::vec3(0,0,1));

        glm::mat4 normalMat = glm::transpose(glm::inverse(modelMat));

        glm::vec3 transformedPts[vertexCount];
        glm::vec3 transformedNrm[vertexCount];
        for (int i = 0; i < vertexCount; i++) {
            glm::vec4 clipPos = perspMat * viewMat * modelMat * glm::vec4(positions[i], 1.0f);
            clipPos /= clipPos.w;
            // Normalize
            float x = remap(clipPos.x, -1.0f, 1.0f, 0.0f, 1.0f);
            float y = remap(clipPos.y, -1.0f, 1.0f, 0.0f, 1.0f);

            transformedPts[i] = glm::vec3(x,y,clipPos.z);
            
            glm::vec4 transNorm = normalMat * glm::vec4(normals[i], 0.0f);
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

        for (int i = 0; i < vertexCount; i+=3) {
            drawTriangleNaive(transformedPts[i], transformedPts[i+1], transformedPts[i+2], transformedNrm[i], transformedNrm[i+1], transformedNrm[i+2]);
        }
        
        return buffer;
    }
}