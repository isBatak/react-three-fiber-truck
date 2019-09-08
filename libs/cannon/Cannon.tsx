import { World, NaiveBroadphase, Vec3, BroadPhase } from 'cannon';
import React, {
  useState,
  useEffect,
  createContext,
  FC,
  memo,
  useMemo,
} from 'react';
import { useRender, useThree } from 'react-three-fiber';
import { DebugRenderer } from './DebugRenderer';

import { useWhyDidYouUpdate } from '../../hooks/useWhyDidYouUpdate';

export const context = createContext(null);

export interface ICannonProps {
  broadphase?: BroadPhase;
  solverIterations?: number;
  gravity?: Vec3;
  debug?: boolean;
}

export const Cannon: FC<ICannonProps> = ({
  broadphase = new NaiveBroadphase(),
  solverIterations = 10,
  gravity = new Vec3(0, -10, 0),
  debug,
  children,
}) => {
  const [world] = useState(() => new World());

  useEffect(() => {
    world.broadphase = broadphase;
    world.solver.iterations = solverIterations;
    world.defaultContactMaterial.friction = 0;
    if (gravity) {
      world.gravity.set(gravity.x, gravity.y, gravity.z);
    }
  }, [broadphase, solverIterations, gravity]);

  const { scene } = useThree();

  const debugRenderer = useMemo(
    () => debug && new DebugRenderer(scene, world),
    [debug]
  );

  useRender(() => {
    world.step(1 / 60), false, [world];
    if (debug) {
      debugRenderer.update();
    }
  });

  return <context.Provider value={world}>{children}</context.Provider>;
};
