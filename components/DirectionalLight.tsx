import React, { FC } from 'react';
import { ReactThreeFiber } from 'react-three-fiber';
import { Color, OrthographicCamera } from 'three';

export interface IDirectionalLight {
  color?: any;
  intensity?: number;
  width?: number;
  height?: number;
  position?: ReactThreeFiber.Vector3;
  lookAt?: Array<number>;
  castShadow?: boolean;
}

export const DirectionalLight: FC<IDirectionalLight> = ({
  color,
  intensity = 0.5,
  position = [10, 10, 20],
  lookAt = [0, 0, 0],
  castShadow = true,
}) => {
  const lightRef = React.useRef(null);

  React.useEffect(() => {
    if (lightRef.current) {
      lightRef.current.shadow.camera = new OrthographicCamera(
        -100,
        100,
        100,
        -100,
        0.5,
        1000
      );
      lightRef.current.shadow.mapSize.width = 2048; // default
      lightRef.current.shadow.mapSize.height = 2048; // default
      lightRef.current.lookAt(lookAt[0], lookAt[1], lookAt[2]);
    }
  }, [lookAt, lightRef]);

  return (
    <>
      <directionalLight
        ref={lightRef}
        intensity={intensity}
        position={position}
        color={color}
        castShadow={castShadow}
      />
    </>
  );
};
