import React from 'react';
import { Canvas } from 'react-three-fiber';

import { Game } from '../scenes/Game';
import { Cannon } from '../libs/cannon/Cannon';
import { Stats2 } from '../components/Stats';

const Index = () => (
  <main>
    <Canvas
      shadowMap
      onCreated={({ gl }) => {
        gl.gammaFactor = 2.2;
        gl.gammaOutput = true;
      }}
    >
      <Stats2 />
      <Cannon>
        <Game />
      </Cannon>
    </Canvas>
    <style global jsx>
      {`
        body {
          margin: 0;
          padding: 0;
        }

        main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #272730;
        }

        canvas {
          background: transparent;
        }
      `}
    </style>
  </main>
);

export default Index;
