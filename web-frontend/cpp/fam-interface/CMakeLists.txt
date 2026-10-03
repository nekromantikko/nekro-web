include(FetchContent)

FetchContent_Declare(
    fam
    GIT_REPOSITORY https://github.com/nekromantikko/fam.git
    GIT_TAG        225db2c7767fb71006efbdb0e0ea00ce5392483b
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
    -sEXPORTED_FUNCTIONS=['_init','_writeRegister','_shutdown','_renderAudio','_malloc','_free']
    -sMODULARIZE
    -sSINGLE_FILE
    -sALLOW_MEMORY_GROWTH=0
    -sINITIAL_MEMORY=32mb
)