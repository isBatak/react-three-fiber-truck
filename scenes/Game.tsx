import { FC, memo } from 'react';
import { Quaternion, Vector3 } from 'three';

import { Vehicle } from '../components/Vehicle';
import Controls from '../components/Controls';
import { Ground } from '../components/Ground';
import { Box } from '../components/Box';
import { DirectionalLight } from '../components/DirectionalLight';
import { AmbientLight } from '../components/AmbientLight';
import { Cannon } from '../libs/cannon/Cannon';
import { Logo } from '../components/Logo';
import { Camera } from '../components/Camera';
import { Effect } from '../components/Effects';

interface IGameProps {}

export const Game: FC<IGameProps> = memo(() => {
  return (
    <>
      <AmbientLight intensity={0.4} />
      <DirectionalLight />

      <Cannon debug>
        <Vehicle url="/static/models/truck.gltf" />
        {/* <Logo url="/static/models/logo.gltf" /> */}
        <Ground color="#FBDF90" />

        {/* <Box position={[1, 4, 1]} />
        <Box position={[2, 4, 5]} />
        <Box position={[0, 4, 6]} />
        <Box position={[-1, 4, 8]} />
        <Box position={[-2, 4, 13]} />
        <Box position={[2, 4, 13]} /> */}
      </Cannon>

      <Camera
        position={[0, -10, 4]}
        quaternion={new Quaternion().setFromAxisAngle(
          new Vector3(1, 0, 0),
          Math.PI / 2.5
        )}
      />

      <Effect />

      {/* <Controls
        autoRotate={false}
        enablePan={true}
        enableZoom={false}
        enableDamping
        dampingFactor={0.5}
        rotateSpeed={1}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 3}
      /> */}
    </>
  );
});
