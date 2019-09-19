import React, { useContext, useEffect, FC } from 'react';
import { Plane, Body } from 'cannon';
import { TextureLoader, Texture, RepeatWrapping, Quaternion } from 'three';

import { CannonContext } from '../libs/cannon/Cannon';
import { useLoader } from '../hooks/useLoader';

interface IGroundProps {
  width?: number;
  height?: number;
  url: string;
}

export const Ground: FC<IGroundProps> = ({
  width = 100,
  height = 100,
  url,
}) => {
  const world = useContext(CannonContext);

  useEffect(() => {
    const plane = new Plane();
    const groundBody = new Body({
      mass: 0,
      shape: plane,
    });

    world.addBody(groundBody);

    return () => {
      world.remove(groundBody);
    };
  }, [world]);

  // @ts-ignore
  const texture = useLoader<Texture>(TextureLoader, url);

  if (texture) {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.x = 50;
    texture.repeat.y = 50;
  }

  return (
    <mesh receiveShadow>
      <planeBufferGeometry attach="geometry" args={[width, height]} />
      <meshLambertMaterial attach="material" map={texture} />
    </mesh>
  );
};
