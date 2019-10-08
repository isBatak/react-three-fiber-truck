import React from 'react';
import { useLoader } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Box as CannonBox, Vec3 } from 'cannon';

import { useCannon } from '../libs/cannon/useCannon';

export const Cardboard = ({ position = [0, 0, 0] }) => {
  const [gltf, objects] = useLoader(
    // @ts-ignore
    GLTFLoader,
    './static/models/cardboard.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco-gltf/');
      loader.setDRACOLoader(dracoLoader);
    }
  );

  return (
    gltf && (
      <mesh name="Cardboard" castShadow receiveShadow>
        <bufferGeometry attach="geometry" {...objects[1].geometry} />
        <meshStandardMaterial
          attach="material"
          {...objects[1].material}
          name="Material"
        />
      </mesh>
    )
  );
};
