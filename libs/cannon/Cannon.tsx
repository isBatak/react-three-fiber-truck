import { World, NaiveBroadphase, Vec3, BroadPhase } from 'cannon';
import React, { useState, useEffect, createContext, FC } from 'react';
import { useRender } from 'react-three-fiber';

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

  console.log(broadphase);

  useEffect(() => {
    world.broadphase = broadphase;
    world.solver.iterations = solverIterations;
    world.gravity.set(gravity.x, gravity.y, gravity.z);
    world.defaultContactMaterial.friction = 0;
  }, [broadphase, solverIterations, gravity.x, gravity.y, gravity.z]);

  useRender(() => world.step(1 / 60), false, [world]);

  return <context.Provider value={world}>{children}</context.Provider>;
};
