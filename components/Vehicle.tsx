import React, { FC, useContext, useEffect, useState } from 'react';
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

const options: IWheelInfoOptions = {
  radius: 0.3,
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
}

// @ts-ignore
export const Vehicle: FC<IVehicle> = ({ url }) => {
  const world = useContext(CannonContext);

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

    const cylinderShape = new Cylinder(
      options.radius,
      options.radius,
      options.radius / 2,
      20
    );
    const wheelBody = new Body({ mass: 1 });
    const quaternion = new Quaternion();
    quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
    wheelBody.addShape(cylinderShape, new Vec3(0, 0, 0), quaternion);

    const axlewidth = 0.8;

    options.chassisConnectionPointLocal.set(axlewidth, 0, -1);
    options.body = wheelBody;
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(-axlewidth, 0, -1);
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(axlewidth, 0, 1);
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(-axlewidth, 0, 1);
    vehicle.addWheel(options);

    vehicle.addToWorld(world);

    return () => {
      vehicle.removeFromWorld(world);
    };
  }, []);

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
