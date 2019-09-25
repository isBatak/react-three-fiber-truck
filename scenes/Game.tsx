import { FC, useRef } from 'react';

import { Vehicle } from '../components/Vehicle';
import { Ground } from '../components/Ground';
import { Box } from '../components/Box';
import { DirectionalLight } from '../components/DirectionalLight';
import { AmbientLight } from '../components/AmbientLight';
import { Logo } from '../components/Logo';
import { Effect } from '../components/Effects';
import { useRaycastVehicle } from '../libs/cannon/useRaycastVehicle';
import { useVehicleKeyboardControls } from '../hooks/useVehicleKeyboardControls';
import { FollowCamera } from '../components/FollowCamera';
import { Object3D, Vector3 } from 'three';
import { Sky } from '../components/Sky';

interface IGameProps {}

export const Game: FC<IGameProps> = () => {
  Object3D.DefaultUp = new Vector3(0, 0, 1);
  const raycastVehicle = useRaycastVehicle();
  const vehicle = useRef<Object3D>(null);
  const cameraDummy = useRef<Object3D>(null);

  useVehicleKeyboardControls(raycastVehicle);

  return (
    <>
      <AmbientLight intensity={0.3} />
      <DirectionalLight />
      <Sky />

      <Vehicle
        ref={vehicle}
        url="/static/models/truck.gltf"
        raycastVehicle={raycastVehicle}
      >
        {/*
        // @ts-ignore */}
        <object3D ref={cameraDummy} name="CameraDummy" position={[-10, 0, 5]} />
      </Vehicle>

      {/* <Logo url="/static/models/logo.gltf" /> */}
      <Ground url="./static/textures/grid.png" />

      <Box position={[1, 4, 1]} />
      <Box position={[2, 4, 5]} />
      <Box position={[0, 4, 6]} />
      <Box position={[-1, 4, 8]} />
      <Box position={[-2, 4, 13]} />
      <Box position={[2, 4, 13]} />

      <FollowCamera target={vehicle} cameraDummy={cameraDummy} />

      <Effect />

      <axesHelper position={[0, 0, 0.01]} />
    </>
  );
};
