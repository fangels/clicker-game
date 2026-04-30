import type { ActionDefinition } from './action.js';
import type { LocaleMessages } from './i18n.js';
import type { QuestDefinition } from './quest.js';
import type { ResourceDefinition } from './resource.js';
import type { StoryNodeDefinition } from './story.js';
import type { ThemeDefinition } from './theme.js';
import type { UpgradeDefinition } from './upgrade.js';
import type { GameState } from './gameState.js';

export type GameMeta = {
  id: string;
  version: string;
  defaultLocale: string;
  supportedLocales: string[];
};

export type GameDefinition = {
  meta: GameMeta;
  theme: ThemeDefinition;
  resources: ResourceDefinition[];
  actions: ActionDefinition[];
  upgrades: UpgradeDefinition[];
  quests: QuestDefinition[];
  story: StoryNodeDefinition[];
  messages: LocaleMessages;
  tickRateMs?: number;
  initialSeed?: number;
  initialState?: Partial<GameState>;
};
