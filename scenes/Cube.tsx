import { FC, useRef } from 'react';
import { useRender } from 'react-three-fiber';
import { Mesh } from 'three';

interface IDemoProps {}

export const Cube: FC<IDemoProps> = () => {
  const cube = useRef<Mesh>(null);

  useRender(
    () => {
      cube.current.rotation.x += 0.005;
      cube.current.rotation.y += 0.01;
    },
    false,
    [cube]
  );

  return (
    <mesh ref={cube}>
      <boxBufferGeometry attach="geometry" args={[200, 200, 200]} />
      <meshBasicMaterial attachArray="material" color="red" />
      <meshBasicMaterial attachArray="material" color="green" />
      <meshBasicMaterial attachArray="material" color="blue" />
      <meshBasicMaterial attachArray="material" color="cyan" />
      <meshBasicMaterial attachArray="material" color="magenta" />
      <meshBasicMaterial attachArray="material" color="yellow" />
    </mesh>
  );
};
