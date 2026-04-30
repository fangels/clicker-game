import { decimalFromString, decimalToString, type Decimal } from './bigNumber.js';
import { migrate, CURRENT_SCHEMA_VERSION } from './migrations.js';
import type { GameState } from './types/gameState.js';
import type { Modifier } from './types/modifier.js';
import type { QuestStatus } from './types/quest.js';
import type { StoryEntry } from './types/story.js';
import type { RngState } from './rng.js';
import type { FlagValue } from './types/gameState.js';

export type SerializedState = {
  schemaVersion: number;
  gameId: string;
  gameVersion: string;
  resources: Record<string, string>;
  clicks: Record<string, number>;
  cooldowns: Record<string, number>;
  upgrades: Record<string, number>;
  quests: Record<string, QuestStatus>;
  story: { seen: string[]; feed: StoryEntry[] };
  modifiers: Modifier[];
  flags: Record<string, FlagValue>;
  rng: RngState;
  lastTickAt: number;
};

export type SaveBlob = {
  blobVersion: 1;
  savedAt: number;
  state: SerializedState;
};

export const serialize = (state: GameState): SaveBlob => {
  const resources: Record<string, string> = {};
  for (const [id, value] of Object.entries(state.resources)) {
    resources[id] = decimalToString(value as Decimal);
  }
  return {
    blobVersion: 1,
    savedAt: Date.now(),
    state: {
      schemaVersion: state.schemaVersion,
      gameId: state.gameId,
      gameVersion: state.gameVersion,
      resources,
      clicks: state.clicks,
      cooldowns: state.cooldowns,
      upgrades: state.upgrades,
      quests: state.quests,
      story: state.story,
      modifiers: state.modifiers,
      flags: state.flags,
      rng: state.rng,
      lastTickAt: state.lastTickAt,
    },
  };
};

export const deserialize = (blob: SaveBlob): GameState => {
  const migrated = migrate(blob.state);
  const resources: Record<string, Decimal> = {};
  for (const [id, raw] of Object.entries(migrated.resources)) {
    resources[id] = decimalFromString(raw);
  }
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    gameId: migrated.gameId,
    gameVersion: migrated.gameVersion,
    resources,
    clicks: migrated.clicks,
    cooldowns: migrated.cooldowns,
    upgrades: migrated.upgrades,
    quests: migrated.quests,
    story: migrated.story,
    modifiers: migrated.modifiers,
    flags: migrated.flags,
    rng: migrated.rng,
    lastTickAt: migrated.lastTickAt,
  };
};

export interface SaveAdapter {
  load(key: string): SaveBlob | null;
  save(key: string, blob: SaveBlob): void;
  clear(key: string): void;
}

export const localStorageAdapter = (storage: Storage): SaveAdapter => ({
  load(key) {
    const raw = storage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SaveBlob;
    } catch {
      return null;
    }
  },
  save(key, blob) {
    storage.setItem(key, JSON.stringify(blob));
  },
  clear(key) {
    storage.removeItem(key);
  },
});
