import React, { FC } from 'react';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// import { useCannon } from '../libs/cannon/useCannon';
import { useLoader } from '../hooks/useLoader';

// const options = {
//   radius: 0.5,
//   directionLocal: Vec3(0, -1, 0),
//   suspensionStiffness: 30,
//   suspensionRestLength: 0.3,
//   frictionSlip: 5,
//   dampingRelaxation: 2.3,
//   dampingCompression: 4.4,
//   maxSuspensionForce: 100000,
//   rollInfluence: 0.01,
//   axleLocal: Vec3(-1, 0, 0),
//   chassisConnectionPointLocal: Vec3(1, 1, 0),
//   maxSuspensionTravel: 0.3,
//   customSlidingRotationalSpeed: -30,
//   useCustomSlidingRotationalSpeed: true,
// };

export interface IVehicle {
  url: String;
}

// @ts-ignore
export const Vehicle: FC<IVehicle> = ({ url }) => {
  // const [scene, set] = React.useState();

  // const ref = useCannon(
  //   { mass: 0 },
  //   body => {
  //     body.addShape(new RaycastVehicle({
  //       hassisBody: null,
  //       indexRightAxis: 0,
  //       indexUpAxis: 1,
  //       indexForwardAxis: 2,

  //     }));
  //     body.position.set(...position);
  //     body.quaternion.set(...quaternion.toArray());
  //   },
  //   [position, quaternion]
  // );

  // @ts-ignore
  const gltf = useLoader<GLTF>(GLTFLoader, url);

  return gltf
    ? gltf.scene.children.map((mesh) => (
        <mesh key={mesh.uuid} {...mesh} castShadow>
          <meshStandardMaterial
            attach="material"
            {...mesh.material}
            roughness={1}
          />
        </mesh>
      ))
    : null;
};
