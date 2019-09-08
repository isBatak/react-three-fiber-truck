import React, { FC, useMemo } from 'react';
import { Vector3, Color } from 'three';

export interface IDirectionalLight {
  color?: Color;
  intensity?: number;
  width?: number;
  height?: number;
  position?: Vector3;
  lookAt?: Array<number>;
  castShadow?: boolean;
}

export const DirectionalLight: FC<IDirectionalLight> = ({
  color,
  intensity = 1,
  position = [3, 10, 4],
  lookAt = [400, 4, 400],
  castShadow = true,
}) => (
  <directionalLight
    intensity={intensity}
    position={position}
    color={color}
    castShadow={castShadow}
    onUpdate={(self) => self.lookAt(lookAt[0], lookAt[1], lookAt[2])}
  />
);
