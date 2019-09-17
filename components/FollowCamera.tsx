import { useRef, useEffect, FC } from 'react';
import { useThree, useRender } from 'react-three-fiber';
import { RaycastVehicle } from 'cannon';
import { Vector3, Camera } from 'three';

interface IFollowCamera {
  offset?: Array<number>;
  follow?: RaycastVehicle;
}

export const FollowCamera: FC<IFollowCamera> = ({ offset, follow }) => {
  const camera = useRef<Camera>(null);
  const { setDefaultCamera } = useThree();
  // @ts-ignore
  useEffect(() => void setDefaultCamera(camera.current), []);
  useRender(
    () => {
      if (camera.current) {
        const chassisPosition = follow.chassisBody.position.clone();
        const position = new Vector3(
          chassisPosition.x,
          chassisPosition.y,
          chassisPosition.z
        );
        const cameraPosition = position
          .clone()
          .add(new Vector3(offset[0], offset[1], offset[2]));
        camera.current.position.lerp(cameraPosition, 0.05);
        camera.current.lookAt(position);
      }
    },
    false,
    [camera]
  );
  return <perspectiveCamera ref={camera} />;
};
