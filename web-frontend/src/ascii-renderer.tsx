import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import WasmWrapper from './wasm/test.js';
import WasmBinary from './wasm/test.wasm';

import { OBJLoader } from '@loaders.gl/obj';
import { load } from '@loaders.gl/core';
import logo from './obj/logo_reverse.obj';

const wasmModuleInstance = await WasmWrapper({
    locateFile: () => WasmBinary
  });

const AsciiRenderer = (props) => {

  const [ str, setStr ] = useState('');
  const requestRef = useRef<number>();

  useEffect(() => {
    const initFunc = wasmModuleInstance.cwrap('init', null, ['number', 'number', 'number', 'array', 'array']);
    const deinitFunc = wasmModuleInstance.cwrap('deinit', null);
    const updateFunc = wasmModuleInstance.cwrap('update', 'string', ['number']);

    const animate = (time) => {
      // const start = performance.now();
      const res = updateFunc(time);
      // console.log(performance.now() - start);
      setStr(res);

      requestRef.current = requestAnimationFrame(animate);
    }

    const init = async () => {
      const data = await load(logo, OBJLoader);

      const vertexCount = data.header?.vertexCount ?? 0;
      const normals = data.attributes.NORMAL.value;
      const positions = data.attributes.POSITION.value;

      // Can't pass float arrays to cpp
      const normalsU8 = new Uint8Array(normals.buffer);
      const positionsU8 = new Uint8Array(positions.buffer);
      
      initFunc(45,25, vertexCount, positionsU8, normalsU8);
      requestRef.current = requestAnimationFrame(animate);
    }

    init();

    return () => {
      if (!!requestRef.current)
        cancelAnimationFrame(requestRef.current);
      deinitFunc();
    }
  }, []);

    return (
      <div className='asciiBoxContainer'>
        <div className='asciiBox'>
          <p>{str}</p>
        </div>
      </div>
    );
}

export default AsciiRenderer;