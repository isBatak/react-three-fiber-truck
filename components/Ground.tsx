import React, { useContext, useEffect } from 'react';
import { Plane, Body } from 'cannon';
import { TextureLoader, Texture, RepeatWrapping } from 'three';

import { CannonContext } from '../libs/cannon/Cannon';
import { useLoader } from '../hooks/useLoader';

export const Ground = ({ width = 100, height = 100, url }) => {
  const world = useContext(CannonContext);

  useEffect(() => {
    const groundBody = new Body({
      mass: 0,
      shape: new Plane(),
    });

    world.addBody(groundBody);

    return () => {
      world.remove(groundBody);
    };
  }, []);

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
