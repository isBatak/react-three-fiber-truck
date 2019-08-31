import * as THREE from 'three';
import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Model({ url }) {
  const [scene, set] = React.useState();

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
          if (obj.name === 'TireFR') {
            const TireFL = obj.clone(true);
            TireFL.name = 'TireFL';
            TireFL.position.set(
              TireFL.position.x,
              TireFL.position.y,
              -TireFL.position.z
            );
            TireFL.scale.z = -1;
            gltf.scene.add(TireFL);

            const TireBR = obj.clone(true);
            TireBR.name = 'TireBR';
            TireBR.position.set(
              -TireBR.position.x,
              TireBR.position.y,
              TireBR.position.z
            );
            gltf.scene.add(TireBR);

            const TireBL = obj.clone(true);
            TireBL.name = 'TireBL';
            TireBL.position.set(
              -TireBL.position.x,
              TireBL.position.y,
              -TireBL.position.z
            );
            TireBL.scale.z = -1;
            gltf.scene.add(TireBL);
          }
        });
        set(gltf.scene);
      }),
    [url]
  );

  return scene ? <primitive object={scene} /> : null;
}

export default Model;
