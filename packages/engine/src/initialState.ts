import { toDecimal, type Decimal } from './bigNumber.js';
import { CURRENT_SCHEMA_VERSION } from './migrations.js';
import { createRngState } from './rng.js';
import type { GameDefinition } from './types/gameDefinition.js';
import type { GameState } from './types/gameState.js';

export const createInitialState = (defs: GameDefinition): GameState => {
  const resources: Record<string, Decimal> = {};
  for (const r of defs.resources) {
    resources[r.id] = toDecimal(r.initial);
  }
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    gameId: defs.meta.id,
    gameVersion: defs.meta.version,
    resources,
    clicks: {},
    cooldowns: {},
    upgrades: {},
    quests: {},
    story: { seen: [], feed: [] },
    modifiers: [],
    flags: {},
    rng: createRngState(defs.initialSeed ?? 1),
    lastTickAt: 0,
    ...(defs.initialState ?? {}),
  };
};
