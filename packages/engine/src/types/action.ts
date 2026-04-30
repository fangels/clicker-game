import type { Numeric } from '../bigNumber.js';
import type { Condition } from './condition.js';
import type { Effect } from './effect.js';
import type { ActionId, ResourceId } from './ids.js';
import type { LocalizedKey } from './i18n.js';

export type ResourceAmount = {
  resourceId: ResourceId;
  amount: Numeric;
};

export type ActionDefinition = {
  id: ActionId;
  label: LocalizedKey;
  description?: LocalizedKey;
  cost?: ResourceAmount[];
  yield?: ResourceAmount[];
  cooldownMs?: number;
  visibleWhen?: Condition;
  enabledWhen?: Condition;
  onClick?: Effect[];
};
