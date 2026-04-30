import type { ActionId, ModifierSourceId, ResourceId } from './ids.js';

export type ModifierTarget =
  | { kind: 'actionYield'; actionId: ActionId; resourceId: ResourceId }
  | { kind: 'actionCost'; actionId: ActionId; resourceId: ResourceId }
  | { kind: 'tickRate'; resourceId: ResourceId };

export type ModifierOp = 'add' | 'mul';

export type Modifier = {
  id: string;
  target: ModifierTarget;
  op: ModifierOp;
  value: number;
  sourceId?: ModifierSourceId;
};
