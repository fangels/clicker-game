import type { Condition } from './condition.js';
import type { Effect } from './effect.js';
import type { UpgradeId } from './ids.js';
import type { LocalizedKey } from './i18n.js';
import type { ResourceAmount } from './action.js';

export type UpgradeDefinition = {
  id: UpgradeId;
  name: LocalizedKey;
  description?: LocalizedKey;
  cost: ResourceAmount[];
  effects: Effect[];
  visibleWhen?: Condition;
  purchasableWhen?: Condition;
  repeatable?: boolean | { max: number };
};
