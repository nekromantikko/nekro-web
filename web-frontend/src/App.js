import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import WasmWrapper from './wasm/test.js';
import WasmBinary from './wasm/test.wasm';

const wasmModuleInstance = await WasmWrapper({
  locateFile: () => WasmBinary
});

const App = () => {
  const [ str, setStr ] = useState('');
  const requestRef = useRef();

  useEffect(() => {
    const initFunc = wasmModuleInstance.cwrap('init', null, ['number', 'number']);
    const deinitFunc = wasmModuleInstance.cwrap('deinit', null);
    const updateFunc = wasmModuleInstance.cwrap('update', 'string', ['number']);

    const animate = (time) => {
      const res = updateFunc(time * 0.001);
      setStr(res);

      requestRef.current = requestAnimationFrame(animate);
    }

    initFunc(45,25);
    requestRef.current = requestAnimationFrame(animate);
    return () => {
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

export default App;
