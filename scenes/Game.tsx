import { FC, memo } from 'react';
import { Quaternion } from 'three';
import { SAPBroadphase } from 'cannon';

import { Vehicle } from '../components/Vehicle';
import Controls from '../components/Controls';
import { Ground } from '../components/Ground';
import { Box } from '../components/Box';
import { DirectionalLight } from '../components/DirectionalLight';
import { AmbientLight } from '../components/AmbientLight';
import { Cannon } from '../libs/cannon/Cannon';

interface IGameProps {}

export const Game: FC<IGameProps> = memo(() => {
  const groundQuaternion = new Quaternion(-0.7, 0, 0, 1);

  return (
    <>
      <AmbientLight intensity={0.4} />
      <DirectionalLight />

      <Cannon debug>
        <Vehicle url="/static/models/truckAO.glb" />
        <Ground quaternion={groundQuaternion} color="#FBDF90" />

        <Box position={[1, 4, 1]} />
        <Box position={[2, 4, 5]} />
        <Box position={[0, 4, 6]} />
        <Box position={[-1, 4, 8]} />
        <Box position={[-2, 4, 13]} />
        <Box position={[2, 4, 13]} />
      </Cannon>

      <Controls
        autoRotate={false}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.5}
        rotateSpeed={1}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
});
