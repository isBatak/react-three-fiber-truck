import { Body } from 'cannon';
import { useState, useEffect, useContext, useRef } from 'react';
import { useRender } from 'react-three-fiber';
import { CannonContext } from './Cannon';

export function useCannon({ ...props }, fn, deps = []) {
  const ref = useRef(null);
  const world = useContext(CannonContext);

  const [body] = useState(() => new Body(props));

  useEffect(() => {
    fn(body);

    world.addBody(body);

    return () => world.remove(body);
  }, deps);

  useRender(() => {
    if (ref.current) {
      ref.current.position.copy(body.position);
      // ref.current.quaternion.copy(body.quaternion);
    }
  });

  return ref;
}
