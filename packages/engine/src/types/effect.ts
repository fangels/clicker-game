import type { Numeric } from '../bigNumber.js';
import type {
  ActionId,
  FlagKey,
  ModifierSourceId,
  QuestId,
  ResourceId,
  StoryNodeId,
  UpgradeId,
} from './ids.js';
import type { Modifier } from './modifier.js';

export type Effect =
  | { kind: 'gainResource'; resourceId: ResourceId; amount: Numeric }
  | { kind: 'spendResource'; resourceId: ResourceId; amount: Numeric }
  | { kind: 'setResource'; resourceId: ResourceId; amount: Numeric }
  | { kind: 'setFlag'; key: FlagKey; value: boolean | number | string }
  | { kind: 'purchaseUpgrade'; upgradeId: UpgradeId }
  | { kind: 'startQuest'; questId: QuestId }
  | { kind: 'completeQuest'; questId: QuestId }
  | { kind: 'failQuest'; questId: QuestId }
  | { kind: 'advanceStory'; nodeId: StoryNodeId }
  | { kind: 'addModifier'; modifier: Modifier }
  | { kind: 'removeModifierBySource'; sourceId: ModifierSourceId }
  | { kind: 'incrementClicks'; actionId: ActionId; by?: number };
