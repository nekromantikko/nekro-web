# nekro-web
Personal portfolio website. Features a 3D ASCII renderer written in C++, compiled to WebAssembly with Emscripten.

## Prerequisites
- [Node.js](https://nodejs.org/) (v22+)
- [CMake](https://cmake.org/) (v3.14+)
- [Ninja](https://ninja-build.org/)
- [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) (for building the C++ renderer)

## Building the C++ renderer

First, activate emsdk in your terminal ([instructions](https://emscripten.org/docs/getting_started/downloads.html)). Then from the `web-frontend` directory:

On Windows (CMD/PowerShell):
```
build.bat
```

On Linux/macOS (or Git Bash on Windows):
```
bash build.sh
```

CMake will fetch GLM automatically on the first run. Output is written to `src/wasm/ascii-renderer.js` and `src/wasm/ascii-renderer.wasm`.

## Running locally

```
cd web-frontend
npm install
npm run dev
```

## Building for production

```
cd web-frontend
npm run build
```

Output is written to `web-frontend/dist/`.

## Credits & Attributions

* **Typography**: The fam sandbox digital readouts utilize the [DSEG Font Family](https://github.com/keshikan/DSEG) by kshji, licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL). See `public/fonts/DSEG-LICENSE.txt` for the full license text.
