import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Vec3, RaycastVehicle } from 'cannon';
import { MeshPhongMaterial } from 'three';

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
      new GLTFLoader().load(url, (gltf) => {
        console.log(gltf.scene);
        gltf.scene.traverse((object) => {
          if (object.type === 'Mesh') {
            object.material.dispose();
            object.material = new MeshPhongMaterial({
              map: object.material.map,
              color: object.material.color,
            });
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        set(gltf.scene);
      }),
    [url]
  );

  return scene ? <primitive object={scene} /> : null;
};
