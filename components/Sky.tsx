import { FC } from 'react';
import { Sky as ThreeSky } from 'three/examples/jsm/objects/Sky.js';
import { extend } from 'react-three-fiber';
import { Vector3 } from 'three';

extend({ Sky: ThreeSky });

export interface ISkyProps {
  inclination?: number;
  azimuth?: number;
  distance?: number;
}

export const Sky: FC<ISkyProps> = ({
  inclination = 0.3,
  azimuth = 0.3,
  distance = 400000,
}) => {
  var theta = Math.PI * (inclination - 0.5);
  var phi = 2 * Math.PI * (azimuth - 0.5);

  const x = distance * Math.cos(phi);
  const y = distance * Math.sin(phi) * Math.cos(theta);
  const z = distance * Math.sin(phi) * Math.sin(theta);

  return (
    <sky
      scale={[450000, 450000, 450000]}
      material-uniforms={{
        luminance: { value: 1 },
        turbidity: { value: 10 },
        rayleigh: { value: 2 },
        mieCoefficient: { value: 0.005 },
        mieDirectionalG: { value: 0.8 },
        sunPosition: { value: new Vector3(x, y, z) },
        up: { value: new Vector3(0, 0, 1) },
      }}
    />
  );
};
