@echo off
emcc cpp/test.cpp -o src/wasm/test.js -sEXPORT_ES6=1 "-sEXPORT_NAME=test" -sENVIRONMENT=web "-sEXPORTED_RUNTIME_METHODS=ccall,cwrap" -I cpp/include/glm
