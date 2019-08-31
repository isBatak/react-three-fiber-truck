export const RectAreaLightDecl = ({
  color = 'white',
  intensity = 1.5,
  width = 1000,
  height = 400,
  position = [100, 200, -700],
  lookAt = [0, 0, 0],
}) => {
  return (
    <rectAreaLight
      intensity={intensity}
      position={position}
      color={color}
      width={width}
      height={height}
      onUpdate={self => self.lookAt(...lookAt)}
    />
  );
};
