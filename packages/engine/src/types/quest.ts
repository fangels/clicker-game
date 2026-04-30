import type { Condition } from './condition.js';
import type { Effect } from './effect.js';
import type { QuestId } from './ids.js';
import type { LocalizedKey } from './i18n.js';

export type QuestStatus = 'inactive' | 'active' | 'completed' | 'failed';

export type QuestDefinition = {
  id: QuestId;
  name: LocalizedKey;
  description?: LocalizedKey;
  startWhen?: Condition;
  completeWhen: Condition;
  failWhen?: Condition;
  rewards?: Effect[];
};
