import React, { FC, useContext, useEffect, useState, useCallback } from 'react';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { useLoader } from '../hooks/useLoader';
import { CannonContext } from '../libs/cannon/Cannon';
import {
  Box,
  Vec3,
  Body,
  RaycastVehicle,
  Material,
  ContactMaterial,
  Quaternion,
  Cylinder,
  IWheelInfoOptions,
} from 'cannon';
import { useEvent } from '../hooks/useEvent';

const wheelInfoOptions: IWheelInfoOptions = {
  radius: 1,
  directionLocal: new Vec3(0, -1, 0),
  suspensionStiffness: 45,
  suspensionRestLength: 0.4,
  frictionSlip: 5,
  dampingRelaxation: 2.3,
  dampingCompression: 4.5,
  maxSuspensionForce: 200000,
  rollInfluence: 0.01,
  axleLocal: new Vec3(-1, 0, 0),
  chassisConnectionPointLocal: new Vec3(1, 1, 0),
  maxSuspensionTravel: 0.25,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
};

export interface IVehicle {
  url: String;
  maxSteerValue?: number;
  maxForce?: number;
  brakeForce?: number;
}

// @ts-ignore
export const Vehicle: FC<IVehicle> = ({
  url,
  maxSteerValue = 0.5,
  maxForce = 1000,
  brakeForce = 1000000,
}) => {
  const world = useContext(CannonContext);
  const [vehicle, setVehicle] = useState();

  useEffect(() => {
    const chassisShape = new Box(new Vec3(1, 0.5, 2));
    const chassisBody = new Body({ mass: 150 });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(0, 4, 0);

    const vehicle = new RaycastVehicle({
      chassisBody: chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexLeftAxis: 2,
    });

    const axlewidth = 0.8;

    wheelInfoOptions.chassisConnectionPointLocal.set(axlewidth, 0, -1);
    vehicle.addWheel(wheelInfoOptions);

    wheelInfoOptions.chassisConnectionPointLocal.set(-axlewidth, 0, -1);
    vehicle.addWheel(wheelInfoOptions);

    wheelInfoOptions.chassisConnectionPointLocal.set(axlewidth, 0, 1);
    vehicle.addWheel(wheelInfoOptions);

    wheelInfoOptions.chassisConnectionPointLocal.set(-axlewidth, 0, 1);
    vehicle.addWheel(wheelInfoOptions);

    vehicle.addToWorld(world);

    setVehicle(vehicle);

    return () => {
      vehicle.removeFromWorld(world);
    };
  }, []);

  const onKeyHandler = useCallback(
    ({ key, type }) => {
      const up = type == 'keyup';
      if (!up && type !== 'keydown') {
        return;
      }

      vehicle.setBrake(0, 0);
      vehicle.setBrake(0, 1);
      vehicle.setBrake(0, 2);
      vehicle.setBrake(0, 3);

      console.log(key, type);

      switch (key) {
        case 'w': // forward
          vehicle.applyEngineForce(up ? 0 : maxForce, 0);
          vehicle.applyEngineForce(up ? 0 : maxForce, 1);
          break;
        case 's': // backward
          vehicle.applyEngineForce(up ? 0 : -maxForce, 0);
          vehicle.applyEngineForce(up ? 0 : -maxForce, 1);
          break;
        case 'd': // right
          vehicle.setSteeringValue(up ? 0 : -maxSteerValue, 0);
          vehicle.setSteeringValue(up ? 0 : -maxSteerValue, 1);
          break;
        case 'a': // left
          vehicle.setSteeringValue(up ? 0 : maxSteerValue, 0);
          vehicle.setSteeringValue(up ? 0 : maxSteerValue, 1);
          break;
        case 'b': // b
          // vehicle.setBrake(brakeForce, 0);
          // vehicle.setBrake(brakeForce, 1);
          vehicle.setBrake(brakeForce, 2);
          vehicle.setBrake(brakeForce, 3);
          break;
      }
    },
    [vehicle]
  );

  useEvent('keyup', onKeyHandler);
  useEvent('keydown', onKeyHandler);

  console.log(vehicle);

  return null;

  // @ts-ignore
  const gltf = useLoader<GLTF>(GLTFLoader, url);

  return gltf
    ? gltf.scene.children.map((mesh) => (
        <mesh key={mesh.uuid} {...mesh} castShadow>
          <meshStandardMaterial
            attach="material"
            {...mesh.material}
            roughness={1}
          />
        </mesh>
      ))
    : null;
};
