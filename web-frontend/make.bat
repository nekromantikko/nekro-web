@echo off
emcc cpp/ascii-renderer.cpp -o src/wasm/ascii-renderer.js -sEXPORT_ES6=1 "-sEXPORT_NAME=asciiRenderer" -sENVIRONMENT=web "-sEXPORTED_RUNTIME_METHODS=ccall,cwrap" -I cpp/include/glm
