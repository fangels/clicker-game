import type { Numeric } from '../bigNumber.js';
import type { ResourceId } from './ids.js';
import type { LocalizedKey } from './i18n.js';
import type { Condition } from './condition.js';

export type ResourceDefinition = {
  id: ResourceId;
  name: LocalizedKey;
  description?: LocalizedKey;
  initial: Numeric;
  min?: Numeric;
  max?: Numeric;
  visibleWhen?: Condition;
};
