import { toDecimal, ZERO, type Decimal } from './bigNumber.js';
import { canClickAction } from './actions.js';
import { evaluateCondition } from './conditions.js';
import { computeActionCost, computeActionYield } from './effects.js';
import type { GameDefinition } from './types/gameDefinition.js';
import type { GameState } from './types/gameState.js';
import type { ActionDefinition } from './types/action.js';
import type { ResourceDefinition } from './types/resource.js';
import type { UpgradeDefinition } from './types/upgrade.js';
import type { QuestDefinition } from './types/quest.js';

export const selectVisibleResources = (state: GameState, defs: GameDefinition): ResourceDefinition[] =>
  defs.resources.filter((r) => !r.visibleWhen || evaluateCondition(r.visibleWhen, state, defs));

export const selectVisibleActions = (state: GameState, defs: GameDefinition): ActionDefinition[] =>
  defs.actions.filter((a) => canClickAction(a.id, state, defs).visible);

export const selectVisibleUpgrades = (state: GameState, defs: GameDefinition): UpgradeDefinition[] =>
  defs.upgrades.filter((u) => !u.visibleWhen || evaluateCondition(u.visibleWhen, state, defs));

export const selectActiveQuests = (state: GameState, defs: GameDefinition): QuestDefinition[] =>
  defs.quests.filter((q) => state.quests[q.id] === 'active');

export const selectCompletedQuests = (state: GameState, defs: GameDefinition): QuestDefinition[] =>
  defs.quests.filter((q) => state.quests[q.id] === 'completed');

export const selectResourceValue = (state: GameState, resourceId: string): Decimal =>
  state.resources[resourceId] ?? ZERO;

export const selectActionDisplay = (
  state: GameState,
  defs: GameDefinition,
  actionId: string,
): {
  cost: Array<{ resourceId: string; amount: Decimal }>;
  yield: Array<{ resourceId: string; amount: Decimal }>;
  enabled: boolean;
  cooldownMs: number;
} => {
  const def = defs.actions.find((a) => a.id === actionId);
  if (!def) return { cost: [], yield: [], enabled: false, cooldownMs: 0 };
  const cost = (def.cost ?? []).map((c) => ({
    resourceId: c.resourceId,
    amount: computeActionCost(state, def.id, c.resourceId, toDecimal(c.amount)),
  }));
  const yieldList = (def.yield ?? []).map((y) => ({
    resourceId: y.resourceId,
    amount: computeActionYield(state, def.id, y.resourceId, toDecimal(y.amount)),
  }));
  return {
    cost,
    yield: yieldList,
    enabled: canClickAction(def.id, state, defs).enabled,
    cooldownMs: state.cooldowns[def.id] ?? 0,
  };
};
