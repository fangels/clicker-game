import { useEffect, useRef } from 'react';
import { useGameStore } from './context.js';

export const useTickLoop = (intervalMs = 100): void => {
  const store = useGameStore();
  const lastRef = useRef<number>(performance.now());

  useEffect(() => {
    const handle = window.setInterval(() => {
      const now = performance.now();
      const dt = now - lastRef.current;
      lastRef.current = now;
      store.getState().tick(dt);
    }, intervalMs);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        const now = performance.now();
        const dt = Math.min(now - lastRef.current, 1000 * 60 * 60 * 24);
        lastRef.current = now;
        store.getState().tick(dt);
      } else {
        lastRef.current = performance.now();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(handle);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs, store]);
};
