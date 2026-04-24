cmake_minimum_required(VERSION 3.14)
project(ascii-renderer)

include(FetchContent)

FetchContent_Declare(
    glm
    GIT_REPOSITORY https://github.com/g-truc/glm.git
    GIT_TAG        1.0.3
    GIT_SHALLOW    TRUE
)
FetchContent_MakeAvailable(glm)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/src/wasm")

add_executable(ascii-renderer cpp/ascii-renderer.cpp)

target_link_libraries(ascii-renderer PRIVATE glm::glm)

target_link_options(ascii-renderer PRIVATE
    -sEXPORT_ES6=1
    -sEXPORT_NAME=asciiRenderer
    -sENVIRONMENT=web
    -sEXPORTED_RUNTIME_METHODS=ccall,cwrap
)
