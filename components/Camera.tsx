import { useRef, useEffect } from 'react';
import { useThree } from 'react-three-fiber';

export const Camera = (props) => {
  const camera = useRef(null);
  const { setDefaultCamera } = useThree();
  useEffect(() => void setDefaultCamera(camera.current), []);
  return <perspectiveCamera ref={camera} {...props} />;
};
