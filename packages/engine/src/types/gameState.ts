import type { Decimal } from '../bigNumber.js';
import type {
  ActionId,
  FlagKey,
  QuestId,
  ResourceId,
  StoryNodeId,
  UpgradeId,
} from './ids.js';
import type { Modifier } from './modifier.js';
import type { QuestStatus } from './quest.js';
import type { StoryEntry } from './story.js';
import type { RngState } from '../rng.js';

export type FlagValue = boolean | number | string;

export type GameState = {
  schemaVersion: number;
  gameId: string;
  gameVersion: string;
  resources: Record<ResourceId, Decimal>;
  clicks: Record<ActionId, number>;
  cooldowns: Record<ActionId, number>;
  upgrades: Record<UpgradeId, number>;
  quests: Record<QuestId, QuestStatus>;
  story: {
    seen: StoryNodeId[];
    feed: StoryEntry[];
  };
  modifiers: Modifier[];
  flags: Record<FlagKey, FlagValue>;
  rng: RngState;
  lastTickAt: number;
};
