import { FC, useRef } from 'react';
import { useRender } from 'react-three-fiber';
import { Mesh, MeshBasicMaterial } from 'three';

interface IDemoProps {}

export const Demo: FC<IDemoProps> = () => {
  const cube = useRef<Mesh>(null);

  useRender(
    () => {
      if (cube.current) {
        cube.current.rotation.x += 0.005;
        cube.current.rotation.y += 0.01;
      }
    },
    false,
    [cube]
  );

  var materials = [
    new MeshBasicMaterial({ color: 'red' }),
    new MeshBasicMaterial({ color: 'green' }),
    new MeshBasicMaterial({ color: 'blue' }),
    new MeshBasicMaterial({ color: 'cyan' }),
    new MeshBasicMaterial({ color: 'magenta' }),
    new MeshBasicMaterial({ color: 'yellow' }),
  ];

  return (
    <mesh ref={cube} material={materials}>
      <boxBufferGeometry attach="geometry" args={[60, 60, 60]} />
    </mesh>
  );
};
