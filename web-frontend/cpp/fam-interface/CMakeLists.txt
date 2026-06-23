include(FetchContent)

FetchContent_Declare(
    fam
    GIT_REPOSITORY https://github.com/nekromantikko/fam.git
    GIT_TAG        e060c28dcc9596c76a7bcd86030a98c3ba19ccba
    GIT_SHALLOW    TRUE
)
FetchContent_MakeAvailable(fam)

add_executable(fam-interface fam-interface.cpp)

set_target_properties(fam-interface PROPERTIES 
    RUNTIME_OUTPUT_DIRECTORY "${WASM_OUTPUT_DIR}/fam-interface")

target_link_libraries(fam-interface PRIVATE fam)

target_link_options(fam-interface PRIVATE
    -sEXPORT_ES6
    -sEXPORT_NAME=FamInterface
    -sENVIRONMENT=worklet
    -sEXPORTED_RUNTIME_METHODS=ccall,cwrap,HEAPF32
    -sEXPORTED_FUNCTIONS=['_init','_writeRegister','_renderAudio','_malloc']
    -sMODULARIZE
    -sSINGLE_FILE
    -sASSERTIONS=2
)