import { useMemo, useState, useEffect } from 'react';
import { Loader } from 'three';

type Extensions = (loader: Loader) => void;

export function useLoader<T>(
  proto: Loader,
  url: string,
  extensions?: Extensions
): T {
  const key = useMemo(() => ({}), [url]);
  const [cache] = useState(() => new WeakMap<object, T>());
  const loader = useMemo(() => {
    const temp = new (proto as any)();
    if (extensions) {
      extensions(temp);
    }
    return temp;
  }, [proto]);
  const [_, forceUpdate] = useState(false);

  console.log(key);

  useEffect(() => {
    if (!cache.has(key)) {
      loader.load(url, (data: T) => {
        cache.set(key, data);
        forceUpdate((i) => !i);
      });
    }
  }, [proto, key]);

  return cache.get(key);
}
