import { FC } from 'react';

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

interface IGameProps {}

export const Game: FC<IGameProps> = () => {
  const raycastVehicle = useRaycastVehicle();

  useVehicleKeyboardControls(raycastVehicle);

  return (
    <>
      <AmbientLight intensity={0.4} />
      <DirectionalLight />

      <Vehicle
        url="/static/models/truck.gltf"
        raycastVehicle={raycastVehicle}
      />

      {/* <Logo url="/static/models/logo.gltf" /> */}
      <Ground url="./static/textures/grid.png" />

      {/* <Box position={[1, 4, 1]} />
      <Box position={[2, 4, 5]} />
      <Box position={[0, 4, 6]} />
      <Box position={[-1, 4, 8]} />
      <Box position={[-2, 4, 13]} />
      <Box position={[2, 4, 13]} /> */}

      <FollowCamera offset={[-10, 0, 4]} follow={raycastVehicle} />

      <Effect />
    </>
  );
};
