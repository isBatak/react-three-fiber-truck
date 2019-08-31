import * as THREE from 'three';
import React from 'react';
import { Canvas } from 'react-three-fiber';

import Model from '../components/model';
import Controls from '../components/controls';
import TruckModel from '../models/lowpoly_truck.glb';
import uniforms from '../utils/uniforms';
import { Ground } from '../components/Ground';
import { RectAreaLightDecl } from '../components/RectAreaLightDecl';
import { CannonProvider } from '../hooks/useCannon';

uniforms.init(THREE);

export default () => (
  <main>
    <Canvas
      camera={{ position: [0, 0, 2] }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.gammaFactor = 2.2;
        gl.gammaOutput = true;
      }}
    >
      <ambientLight intensity={0.2} />
      <RectAreaLightDecl />
      <RectAreaLightDecl
        intensity={4}
        width={100}
        height={1000}
        position={[0, 0, 2000]}
        color="purple"
      />

      <RectAreaLightDecl
        intensity={0.5}
        width={500}
        height={1000}
        position={[0, 1000, 0]}
      />

      <RectAreaLightDecl
        intensity={5}
        width={1000}
        height={100}
        position={[-800, 0, 800]}
      />

      <CannonProvider>
        <Model url={TruckModel} />

        <Ground />
      </CannonProvider>

      <Controls
        autoRotate
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.5}
        rotateSpeed={1}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
    <style global jsx>
      {`
        body {
          margin: 0;
          padding: 0;
        }

        canvas {
          background: transparent;
        }

        main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #272730;
        }
      `}
    </style>
  </main>
);
