import { createContext, useContext } from 'react';
import type { GameStoreApi } from './store.js';

export const GameStoreContext = createContext<GameStoreApi | null>(null);

export const useGameStore = (): GameStoreApi => {
  const ctx = useContext(GameStoreContext);
  if (!ctx) throw new Error('GameStoreContext is not provided.');
  return ctx;
};
