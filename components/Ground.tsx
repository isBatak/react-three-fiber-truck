import React, { useContext, useEffect } from 'react';
import { Plane, Body, Vec3, Quaternion as CannonQuaternion } from 'cannon';
import {
  Quaternion as ThreeQuaternion,
  Vector3,
  MeshLambertMaterial,
  Color,
} from 'three';

import { CannonContext } from '../libs/cannon/Cannon';
import { useUpdate } from 'react-three-fiber';

export const Ground = ({
  width = 100,
  height = 100,
  color = '#FFFFFF',
  position = new Vector3(0, 0, 0),
}) => {
  // const quaternion = new ThreeQuaternion().setFromAxisAngle(
  //   new Vector3(1, 0, 0),
  //   -Math.PI / 2
  // );
  const world = useContext(CannonContext);

  useEffect(() => {
    const groundBody = new Body({
      mass: 0,
      // position: new Vec3(position.x, position.y, position.z),
      // quaternion: new CannonQuaternion(
      //   quaternion.x,
      //   quaternion.y,
      //   quaternion.z,
      //   quaternion.w
      // ),
      shape: new Plane(),
    });

    // groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);

    world.addBody(groundBody);

    return () => {
      world.remove(groundBody);
    };
  }, []);

  return (
    <mesh receiveShadow>
      <planeBufferGeometry attach="geometry" args={[width, height]} />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
};
