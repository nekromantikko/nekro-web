import React from 'react';
import './App.css';

import artstation from './img/ArtStation-logomark-white-cropped.svg';
import github from './img/github-mark-white.svg';
import linkedin from './img/LI-In-Bug.png';

import LogoLink from './logo-link.tsx';
import AsciiRenderer from './ascii-renderer.tsx';

const App = () => {
  

  return (
    <div className='App'>
      <AsciiRenderer />
      <h2>Joona Pääkkönen</h2>
      <p>3D generalist, technical artist, software developer</p>
      <div className='linkContainer'>
        <LogoLink url='https://www.artstation.com/jpr' img={artstation} alt='artstation' />
        <LogoLink url='https://github.com/nekromantikko' img={github} alt='github' />
        <LogoLink url='https://www.linkedin.com/in/joonapaakkonen' img={linkedin} alt='linkedin' />
      </div>
    </div>
  );
}

export default App;
