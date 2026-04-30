import { create } from 'zustand';
import {
  clickAction as engineClickAction,
  createInitialState,
  deserialize,
  localStorageAdapter,
  purchaseUpgrade as enginePurchaseUpgrade,
  serialize,
  tick as engineTick,
  type GameDefinition,
  type GameState,
  type SaveAdapter,
} from '@clicker-game/engine';

const SAVE_KEY = 'clicker-game.save';

type GameStore = {
  defs: GameDefinition;
  state: GameState;
  click: (actionId: string) => void;
  buy: (upgradeId: string) => void;
  tick: (dtMs: number) => void;
  reset: () => void;
};

const adapter: SaveAdapter | null =
  typeof window !== 'undefined' && window.localStorage ? localStorageAdapter(window.localStorage) : null;

const loadInitial = (defs: GameDefinition): GameState => {
  if (!adapter) return createInitialState(defs);
  const blob = adapter.load(SAVE_KEY);
  if (!blob) return createInitialState(defs);
  if (blob.state.gameId !== defs.meta.id) return createInitialState(defs);
  try {
    return deserialize(blob);
  } catch {
    return createInitialState(defs);
  }
};

const persist = (state: GameState): void => {
  if (!adapter) return;
  adapter.save(SAVE_KEY, serialize(state));
};

export const createGameStore = (defs: GameDefinition) =>
  create<GameStore>((set, get) => ({
    defs,
    state: loadInitial(defs),
    click(actionId) {
      const { state, defs } = get();
      const result = engineClickAction(state, actionId, defs);
      if (result.ok) {
        set({ state: result.state });
        persist(result.state);
      }
    },
    buy(upgradeId) {
      const { state, defs } = get();
      const result = enginePurchaseUpgrade(state, upgradeId, defs);
      if (result.ok) {
        set({ state: result.state });
        persist(result.state);
      }
    },
    tick(dtMs) {
      const { state, defs } = get();
      const next = engineTick(state, dtMs, defs);
      if (next !== state) {
        set({ state: next });
        persist(next);
      }
    },
    reset() {
      const { defs } = get();
      const fresh = createInitialState(defs);
      set({ state: fresh });
      if (adapter) adapter.clear(SAVE_KEY);
    },
  }));

export type GameStoreApi = ReturnType<typeof createGameStore>;
