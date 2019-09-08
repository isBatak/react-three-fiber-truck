import { World, NaiveBroadphase, Vec3, BroadPhase } from 'cannon';
import React, { useState, useEffect, createContext, FC, memo } from 'react';
import { useRender } from 'react-three-fiber';

import { useWhyDidYouUpdate } from '../../hooks/useWhyDidYouUpdate';

export const context = createContext(null);

export interface ICannonProps {
  broadphase?: BroadPhase;
  solverIterations?: number;
  gravity?: Vec3;
}

export const Cannon: FC<ICannonProps> = ({
  broadphase = new NaiveBroadphase(),
  solverIterations = 10,
  gravity = new Vec3(0, 0, -30),
  children,
}) => {
  const [world] = useState(() => new World());

  useEffect(() => {
    world.broadphase = broadphase;
    world.solver.iterations = solverIterations;
    if (gravity) {
      world.gravity.set(gravity.x, gravity.y, gravity.z);
    }
    world.defaultContactMaterial.friction = 0;
  }, [broadphase, solverIterations, gravity]);

  useRender(() => world.step(1 / 60), false, [world]);

  return <context.Provider value={world}>{children}</context.Provider>;
};
