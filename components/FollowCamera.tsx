import { useRef, useEffect, FC, RefObject } from 'react';
import { useThree, useFrame, Camera } from 'react-three-fiber';
import { Vector3, Object3D } from 'three';

interface IFollowCamera {
  target: RefObject<Object3D>;
  cameraDummy: RefObject<Object3D>;
}

export const FollowCamera: FC<IFollowCamera> = ({ target, cameraDummy }) => {
  const camera = useRef<Camera>(null);
  const { setDefaultCamera } = useThree();

  useEffect(() => void setDefaultCamera(camera.current), []);
  useFrame(() => {
    if (camera.current && target.current && cameraDummy.current) {
      const temp = new Vector3().setFromMatrixPosition(
        cameraDummy.current.matrixWorld
      );
      camera.current.position.lerp(temp, 0.05);
      camera.current.lookAt(target.current.position);
    }
  });

  return <perspectiveCamera ref={camera} />;
};
