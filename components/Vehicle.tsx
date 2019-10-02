import React, { FC, useRef, forwardRef, ReactNode } from 'react';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { RaycastVehicle } from 'cannon';
import composeRefs from '@seznam/compose-react-refs';

import { useLoader } from '../hooks/useLoader';
import { Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { useFrame } from 'react-three-fiber';

const findMeshByName = (name: string) => (item: Mesh) => item.name === name;

const updateBody = (raycastVehicle, vehicleBodyRef) => {
  vehicleBodyRef.current.position.copy(
    new Vector3(
      raycastVehicle.chassisBody.position.x,
      raycastVehicle.chassisBody.position.y,
      raycastVehicle.chassisBody.position.z
    )
  );

  vehicleBodyRef.current.quaternion.copy(
    new Quaternion(
      raycastVehicle.chassisBody.quaternion.x,
      raycastVehicle.chassisBody.quaternion.y,
      raycastVehicle.chassisBody.quaternion.z,
      raycastVehicle.chassisBody.quaternion.w
    )
  );
};

const updateWheel = (wheelIndex, raycastVehicle, tireRef) => {
  raycastVehicle.updateWheelTransform(wheelIndex);
  const transform = raycastVehicle.wheelInfos[wheelIndex].worldTransform;
  tireRef.current.position.copy(
    new Vector3(
      transform.position.x,
      transform.position.y,
      transform.position.z
    )
  );
  tireRef.current.quaternion.copy(
    new Quaternion(
      transform.quaternion.x,
      transform.quaternion.y,
      transform.quaternion.z,
      transform.quaternion.w
    )
  );
};

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

    const vehicleTireFRMesh =
      gltf && gltf.scene.children.find(findMeshByName('TireFR'));
    const vehicleTireFLMesh =
      gltf && gltf.scene.children.find(findMeshByName('TireFL'));
    const vehicleTireBRMesh =
      gltf && gltf.scene.children.find(findMeshByName('TireBR'));
    const vehicleTireBLMesh =
      gltf && gltf.scene.children.find(findMeshByName('TireBL'));
    // const vehicleSteeringWheelMesh =
    //   gltf && gltf.scene.children.find(findMeshByName('SteeringWheel'));

    const localVehicleBodyRef = useRef<Mesh>(null);
    const vehicleTireFRRef = useRef<Mesh>(null);
    const vehicleTireFLRef = useRef<Mesh>(null);
    const vehicleTireBRRef = useRef<Mesh>(null);
    const vehicleTireBLRef = useRef<Mesh>(null);
    // const vehicleSteeringWheelRef = useRef<Mesh>(null);

    useFrame(() => {
      // @ts-ignore
      if (localVehicleBodyRef.current && raycastVehicle) {
        updateBody(raycastVehicle, localVehicleBodyRef);

        updateWheel(0, raycastVehicle, vehicleTireFLRef);
        updateWheel(1, raycastVehicle, vehicleTireFRRef);
        updateWheel(2, raycastVehicle, vehicleTireBLRef);
        updateWheel(3, raycastVehicle, vehicleTireBRRef);
      }
    });

    return gltf ? (
      <group>
        <mesh
          ref={composeRefs(localVehicleBodyRef, ref)}
          name="Body"
          {...vehicleBodyMesh}
          castShadow
        >
          {children}
        </mesh>
        <mesh ref={vehicleTireFRRef} {...vehicleTireFRMesh} castShadow />
        <mesh ref={vehicleTireFLRef} {...vehicleTireFLMesh} castShadow />
        <mesh ref={vehicleTireBRRef} {...vehicleTireBRMesh} castShadow />
        <mesh ref={vehicleTireBLRef} {...vehicleTireBLMesh} castShadow />
        {/* <mesh ref={vehicleSteeringWheelRef} {...vehicleSteeringWheelMesh} /> */}
      </group>
    ) : null;
  }
);
