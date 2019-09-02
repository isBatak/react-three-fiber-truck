import React from 'react';

export const DirectionalLight = ({
  color = 'white',
  intensity = 1,
  width = 1000,
  height = 400,
  position = [100, 200, -700],
  lookAt = [0, 0, 0],
  castShadow = true,
}) => {
  return (
    <directionalLight
      intensity={intensity}
      position={position}
      color={color}
      width={width}
      height={height}
      onUpdate={(self) => self.lookAt(...lookAt)}
      castShadow={castShadow}
    />
  );
};
