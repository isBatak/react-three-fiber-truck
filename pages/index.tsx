import * as THREE from 'three';
import React from 'react';
import dynamic from 'next/dynamic';
import { CanvasProps } from 'react-three-fiber';
import { Vector3 } from 'three';

import { Game } from '../components/scenes/Game';

const DynamicCanvasNoSSR = dynamic<CanvasProps>(
  () => import('react-three-fiber').then((mod) => mod.Canvas),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const Index = () => (
  <main>
    <DynamicCanvasNoSSR
      camera={{ position: new Vector3(0, 0, 2) }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.gammaFactor = 2.2;
        gl.gammaOutput = true;
      }}
    >
      <Game />
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
