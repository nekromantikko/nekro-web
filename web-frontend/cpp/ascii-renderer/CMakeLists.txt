include(FetchContent)

FetchContent_Declare(
    glm
    GIT_REPOSITORY https://github.com/g-truc/glm.git
    GIT_TAG        1.0.3
    GIT_SHALLOW    TRUE
)
FetchContent_MakeAvailable(glm)

add_executable(ascii-renderer ascii-renderer.cpp)

set_target_properties(ascii-renderer PROPERTIES 
    RUNTIME_OUTPUT_DIRECTORY "${WASM_OUTPUT_DIR}/ascii-renderer")

target_link_libraries(ascii-renderer PRIVATE glm::glm)

target_link_options(ascii-renderer PRIVATE
    -sEXPORT_ES6=1
    -sEXPORT_NAME=AsciiRenderer
    -sENVIRONMENT=web
    -sEXPORTED_RUNTIME_METHODS=ccall,cwrap
)
