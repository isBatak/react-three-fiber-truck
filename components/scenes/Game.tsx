import { FC, useMemo } from 'react';
import { Quaternion } from 'three';
import { SAPBroadphase } from 'cannon';

import { Vehicle } from '../Vehicle';
import Controls from '../Controls';
import { Ground } from '../Ground';
import { DirectionalLight } from '../DirectionalLight';
import { AmbientLight } from '../AmbientLight';
import { Cannon } from '../../libs/cannon/Cannon';

interface IGameProps {}

export const Game: FC<IGameProps> = (props) => {
  const groundQuaternion = new Quaternion(-0.7, 0, 0, 1);
  const broadpass = new SAPBroadphase();

  return (
    <>
      <AmbientLight intensity={0.4} />
      <DirectionalLight />

      <Cannon broadphase={broadpass}>
        <Vehicle url="/static/models/truckAO.glb" />
        <Ground quaternion={groundQuaternion} color="#FBDF90" />
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
};
