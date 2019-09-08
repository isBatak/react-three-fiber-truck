import React from 'react';

import { useCannon } from '../libs/cannon/useCannon';
import { Box as CannonBox, Vec3 } from 'cannon';

export const Box = ({ position = [0, 0, 0] }) => {
  const ref = useCannon({ mass: 10000 }, (body) => {
    body.addShape(new CannonBox(new Vec3(1, 1, 1)));
    body.position.set(...position);
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
};
