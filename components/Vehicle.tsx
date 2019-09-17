import React, { FC, useRef } from 'react';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { RaycastVehicle } from 'cannon';

import { useLoader } from '../hooks/useLoader';
import { Mesh } from 'three';
import { useRender } from 'react-three-fiber';

const findMeshByName = (name: string) => (item: Mesh) => item.name === name;

export interface IVehicle {
  url: String;
  raycastVehicle: RaycastVehicle;
  // maxSteerValue?: number;
  // maxForce?: number;
  // brakeForce?: number;
}

export const Vehicle: FC<IVehicle> = ({
  url,
  raycastVehicle,
  // maxSteerValue = 0.5,
  // maxForce = 1000,
  // brakeForce = 1000000,
}) => {
  // @ts-ignore
  const gltf = useLoader<GLTF>(GLTFLoader, url);

  const vehicleBodyMesh =
    gltf && gltf.scene.children.find(findMeshByName('Body'));

  const ref = useRef<Mesh>(null);

  useRender(
    () => {
      if (ref.current && raycastVehicle) {
        ref.current.position.copy(raycastVehicle.chassisBody.position);
        ref.current.quaternion.copy(raycastVehicle.chassisBody.quaternion);
      }
    },
    false,
    [ref, raycastVehicle]
  );

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[4, 2, 1]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );

  return gltf ? (
    <mesh ref={ref} name="Body" {...vehicleBodyMesh} castShadow />
  ) : null;
};
