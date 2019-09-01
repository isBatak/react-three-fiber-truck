import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Vec3, RaycastVehicle } from 'cannon';

import { useCannon } from '../hooks/useCannon';

const options = {
  radius: 0.5,
  directionLocal: Vec3(0, -1, 0),
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  frictionSlip: 5,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  maxSuspensionForce: 100000,
  rollInfluence: 0.01,
  axleLocal: Vec3(-1, 0, 0),
  chassisConnectionPointLocal: Vec3(1, 1, 0),
  maxSuspensionTravel: 0.3,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
};

export const Vehicle = ({ url }) => {
  const [scene, set] = React.useState();

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

  React.useMemo(
    () =>
      new GLTFLoader().load(url, gltf => {
        gltf.scene.traverse(obj => {
          // if (obj.type === 'Mesh') {
          //   obj.material.dispose();
          //   obj.material = new THREE.MeshPhysicalMaterial({
          //     roughness: 0.5,
          //     clearCoat: 1,
          //     clearCoatRoughness: 0.3,
          //     color: obj.material.color,
          //   });
          // }
          // if (obj.name === 'TireFR') {
          //   const TireFL = obj.clone(true);
          //   TireFL.name = 'TireFL';
          //   TireFL.position.set(
          //     TireFL.position.x,
          //     TireFL.position.y,
          //     -TireFL.position.z
          //   );
          //   TireFL.scale.z = -1;
          //   gltf.scene.add(TireFL);
          //   const TireBR = obj.clone(true);
          //   TireBR.name = 'TireBR';
          //   TireBR.position.set(
          //     -TireBR.position.x,
          //     TireBR.position.y,
          //     TireBR.position.z
          //   );
          //   gltf.scene.add(TireBR);
          //   const TireBL = obj.clone(true);
          //   TireBL.name = 'TireBL';
          //   TireBL.position.set(
          //     -TireBL.position.x,
          //     TireBL.position.y,
          //     -TireBL.position.z
          //   );
          //   TireBL.scale.z = -1;
          //   gltf.scene.add(TireBL);
          // }
        });
        set(gltf.scene);
      }),
    [url]
  );

  return scene ? <primitive object={scene} /> : null;
};
