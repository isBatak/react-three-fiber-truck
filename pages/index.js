import * as THREE from 'three';
import React from 'react';
import dynamic from 'next/dynamic';

import { Vehicle } from '../components/Vehicle';
import Controls from '../components/Controls';
import { Ground } from '../components/Ground';
import { Quaternion } from 'three';
import { DirectionalLight } from '../components/DirectionalLight';
import { AmbientLight } from '../components/AmbientLight';
import { Cannon } from '../libs/cannon/Cannon';
import { SAPBroadphase } from 'cannon';

const DynamicCanvasNoSSR = dynamic(
  () => import('react-three-fiber').then((mod) => mod.Canvas),
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
      <AmbientLight intensity={0.4} />
      <DirectionalLight />

      <Cannon broadphase={new SAPBroadphase()}>
        <Vehicle url="/static/models/truck.glb" />

        <Ground quaternion={new Quaternion(-0.7, 0, 0, 1)} color="#FBDF90" />
      </Cannon>

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
