import React from 'react';
import { Plane } from 'cannon';

import { useCannon } from '../hooks/useCannon';

export const Ground = ({
  width = 100,
  height = 100,
  color = '#FFFFFF',
  position = [0, 0, 0],
}) => {
  const ref = useCannon({ mass: 0 }, body => {
    body.addShape(new Plane());
    body.position.set(...position);
  });

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[width, height]} />
      <meshBasicMaterial attach="material" color={color} />
    </mesh>
  );
};
