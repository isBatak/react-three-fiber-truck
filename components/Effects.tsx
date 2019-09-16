import { useThree, useRender } from 'react-three-fiber';
import { useMemo, useEffect } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Vector2 } from 'three';

export const Effect = () => {
  const { gl, scene, camera, size } = useThree();

  const [bloom] = useMemo(() => {
    const renderScene = new RenderPass(scene, camera);
    const comp = new EffectComposer(gl);

    comp.addPass(renderScene);
    comp.addPass(
      new UnrealBloomPass(new Vector2(size.width, size.height), 1, 1.5, 0)
    );
    // @ts-ignore
    comp.renderToScreen = true;
    return [comp];
  }, []);

  useEffect(() => {
    bloom.setSize(size.width, size.height);
  }, [bloom, size]);

  useRender(() => {
    bloom.render();
  });
  return null;
};
