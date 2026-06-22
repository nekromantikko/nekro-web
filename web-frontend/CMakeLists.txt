cmake_minimum_required(VERSION 3.14)
project(nekro-web-wasm)

if(NOT EMSCRIPTEN)
    message(FATAL_ERROR "This CMake project must be compiled using Emscripten (emcmake).")
endif()

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -O3")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3")

set(WASM_OUTPUT_DIR "${CMAKE_CURRENT_LIST_DIR}/src/wasm")

add_subdirectory(cpp/ascii-renderer)
add_subdirectory(cpp/fam-interface)
