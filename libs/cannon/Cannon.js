import { World, NaiveBroadphase, Vec3 } from 'cannon';
import React, { useState, useEffect } from 'react';
import { useRender } from 'react-three-fiber';

export const context = React.createContext();

export const Cannon = ({
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
  }, [broadphase, solverIterations, gravity.x, gravity.y, gravity.z]);

  useRender(() => world.step(1 / 60), false, [world]);

  return <context.Provider value={world}>{children}</context.Provider>;
};
