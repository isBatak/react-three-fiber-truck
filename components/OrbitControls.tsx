import React, { useRef } from 'react';
import { useThree, useRender, extend } from 'react-three-fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ ThreeOrbitControls });

export const OrbitControls = (props) => {
  const { camera } = useThree();
  const ref = useRef(null);

  useRender(() => {
    ref.current && ref.current.update();
  });

  // @ts-ignore
  return <orbitControls ref={ref} args={[camera]} {...props} />;
};
