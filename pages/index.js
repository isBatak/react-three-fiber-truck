import * as THREE from 'three';
import React from 'react';
// import { Canvas } from 'react-three-fiber';
import dynamic from 'next/dynamic';

import { Vehicle } from '../components/Vehicle';
import Controls from '../components/controls';
import TruckModel from '../models/lowpoly_truck.glb';
// import uniforms from '../utils/uniforms';
import { Ground } from '../components/Ground';
import { RectAreaLightDecl } from '../components/RectAreaLightDecl';
import { CannonProvider } from '../hooks/useCannon';
import { Quaternion } from 'three';

const DynamicCanvasNoSSR = dynamic(
  () => import('react-three-fiber').then(mod => mod.Canvas),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

// uniforms.init(THREE);

const Index = () => (
  <main>
    <DynamicCanvasNoSSR
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
        <Vehicle url={TruckModel} />

        <Ground quaternion={new Quaternion(-0.7, 0, 0, 1)} />
      </CannonProvider>

      <Controls
        autoRotate={false}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.5}
        rotateSpeed={1}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 3}
      />
    </DynamicCanvasNoSSR>
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

export default Index;
