import type { Numeric } from '../bigNumber.js';
import type {
  ActionId,
  FlagKey,
  QuestId,
  ResourceId,
  StoryNodeId,
  UpgradeId,
} from './ids.js';

export type Condition =
  | { kind: 'always' }
  | { kind: 'never' }
  | { kind: 'resourceAtLeast'; resourceId: ResourceId; amount: Numeric }
  | { kind: 'resourceAtMost'; resourceId: ResourceId; amount: Numeric }
  | { kind: 'actionClickedAtLeast'; actionId: ActionId; times: number }
  | { kind: 'upgradePurchased'; upgradeId: UpgradeId; atLeast?: number }
  | { kind: 'questActive'; questId: QuestId }
  | { kind: 'questCompleted'; questId: QuestId }
  | { kind: 'storyNodeSeen'; nodeId: StoryNodeId }
  | { kind: 'flagEquals'; key: FlagKey; value: boolean | number | string }
  | { kind: 'and'; all: Condition[] }
  | { kind: 'or'; any: Condition[] }
  | { kind: 'not'; cond: Condition };
