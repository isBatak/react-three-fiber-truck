import React, { FC, useMemo } from 'react';
import { Vector3, Color } from 'three';

export interface IDirectionalLight {
  color?: string;
  intensity?: number;
  width?: number;
  height?: number;
  position?: Vector3;
  lookAt?: Array<number>;
  castShadow?: boolean;
}

export const DirectionalLight: FC<IDirectionalLight> = ({
  color = '0xffffff',
  intensity = 1,
  position = [3, 10, 4],
  lookAt = [400, 4, 400],
  castShadow = true,
}) => {
  const colorInstance = useMemo(() => new Color(color), [color]);

  return (
    <directionalLight
      intensity={intensity}
      position={position}
      color={colorInstance}
      castShadow={castShadow}
      onUpdate={(self) => self.lookAt(lookAt[0], lookAt[1], lookAt[2])}
    />
  );
};
