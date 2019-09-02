import React from 'react';
import { Plane } from 'cannon';
import { Quaternion } from 'three';

import { useCannon } from '../hooks/useCannon';

export const Ground = ({
  width = 100,
  height = 100,
  color = '#FFFFFF',
  position = [0, 0, 0],
  quaternion = new Quaternion(-0.7, 0, 0, 1),
}) => {
  const ref = useCannon(
    { mass: 0 },
    (body) => {
      body.addShape(new Plane());
      body.position.set(...position);
      body.quaternion.set(...quaternion.toArray());
    },
    [position, quaternion]
  );

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[width, height]} />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
};
