import React, { FC, useRef, forwardRef, ReactNode } from 'react';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { RaycastVehicle } from 'cannon';
import composeRefs from '@seznam/compose-react-refs';

import { useLoader } from '../hooks/useLoader';
import { Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { useRender } from 'react-three-fiber';

const findMeshByName = (name: string) => (item: Mesh) => item.name === name;

export interface IVehicle {
  url: String;
  raycastVehicle: RaycastVehicle;
  children?: ReactNode;
}

export const Vehicle = forwardRef<Object3D, IVehicle>(
  ({ url, raycastVehicle, children }, ref) => {
    // @ts-ignore
    const gltf = useLoader<GLTF>(GLTFLoader, url);

    const vehicleBodyMesh =
      gltf && gltf.scene.children.find(findMeshByName('Body'));

    const localRef = useRef<Mesh>(null);

    useRender(
      () => {
        // @ts-ignore
        if (localRef.current && raycastVehicle) {
          localRef.current.position.copy(
            new Vector3(
              raycastVehicle.chassisBody.position.x,
              raycastVehicle.chassisBody.position.y,
              raycastVehicle.chassisBody.position.z
            )
          );

          localRef.current.quaternion.copy(
            new Quaternion(
              raycastVehicle.chassisBody.quaternion.x,
              raycastVehicle.chassisBody.quaternion.y,
              raycastVehicle.chassisBody.quaternion.z,
              raycastVehicle.chassisBody.quaternion.w
            )
          );
        }
      },
      false,
      [localRef, raycastVehicle]
    );

    // return (
    //   <mesh ref={composeRefs(localRef, ref)} castShadow receiveShadow>
    //     <boxGeometry attach="geometry" args={[4, 2, 1]} />
    //     <meshStandardMaterial attach="material" />
    //     {children}
    //   </mesh>
    // );

    return gltf ? (
      <mesh
        ref={composeRefs(localRef, ref)}
        name="Body"
        {...vehicleBodyMesh}
        castShadow
      >
        {children}
      </mesh>
    ) : null;
  }
);
