import React, { FC } from 'react';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { useLoader } from '../hooks/useLoader';

export interface IVehicle {
  url: String;
}

export const Logo: FC<IVehicle> = ({ url }) => {
  // @ts-ignore
  const gltf = useLoader<GLTF>(GLTFLoader, url);

  return gltf
    ? gltf.scene.children.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))
    : null;
};
