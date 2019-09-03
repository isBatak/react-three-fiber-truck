import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const useGLTFLoader = (url) => {
  const [gltf, setData] = React.useState(null);

  React.useEffect(() => new GLTFLoader().load(url, (gltf) => setData(gltf)), [
    url,
  ]);

  return gltf;
};
