import React from 'react';
import { Canvas } from 'react-three-fiber';

import { Game } from '../scenes/Game';
import { Cannon } from '../libs/cannon/Cannon';
import { Stats2 } from '../components/Stats';
import { Joystick } from '../components/ui/Joystick';
import {
  joystickEngineForceEventDispatcher,
  joystickSteeringEventDispatcher,
} from '../utils/joystick';

const Index = () => {
  return (
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

      <div className="joystick right">
        <Joystick lockAxis="x" onChange={joystickSteeringEventDispatcher} />
      </div>

      <div className="joystick left">
        <Joystick lockAxis="y" onChange={joystickEngineForceEventDispatcher} />
      </div>

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

          .joystick.right {
            position: absolute;
            bottom: 20px;
            right: 20px;
          }

          .joystick.left {
            position: absolute;
            bottom: 20px;
            left: 20px;
          }
        `}
      </style>
    </main>
  );
};

export default Index;
