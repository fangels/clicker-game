import { toDecimal, ZERO } from './bigNumber.js';
import { evaluateCondition } from './conditions.js';
import { applyEffect, applyEffects, type EffectResult } from './effects.js';
import { computeActionCost, computeActionYield } from './effects.js';
import type { ActionDefinition } from './types/action.js';
import type { Effect } from './types/effect.js';
import type { GameDefinition } from './types/gameDefinition.js';
import type { GameState } from './types/gameState.js';

const isActionVisible = (def: ActionDefinition, state: GameState, defs: GameDefinition): boolean =>
  def.visibleWhen ? evaluateCondition(def.visibleWhen, state, defs) : true;

const isActionEnabled = (def: ActionDefinition, state: GameState, defs: GameDefinition): boolean => {
  if ((state.cooldowns[def.id] ?? 0) > 0) return false;
  if (def.enabledWhen && !evaluateCondition(def.enabledWhen, state, defs)) return false;
  for (const c of def.cost ?? []) {
    const have = state.resources[c.resourceId] ?? ZERO;
    const need = computeActionCost(state, def.id, c.resourceId, toDecimal(c.amount));
    if (have.lt(need)) return false;
  }
  return true;
};

export const canClickAction = (
  actionId: string,
  state: GameState,
  defs: GameDefinition,
): { visible: boolean; enabled: boolean } => {
  const def = defs.actions.find((a) => a.id === actionId);
  if (!def) return { visible: false, enabled: false };
  return { visible: isActionVisible(def, state, defs), enabled: isActionEnabled(def, state, defs) };
};

export const clickAction = (
  state: GameState,
  actionId: string,
  defs: GameDefinition,
): EffectResult => {
  const def = defs.actions.find((a) => a.id === actionId);
  if (!def) return { ok: false, reason: { reason: 'unknownResource', resourceId: actionId } };
  if (!isActionVisible(def, state, defs) || !isActionEnabled(def, state, defs)) {
    return { ok: false, reason: { reason: 'insufficientResource', resourceId: '*', needed: '0', available: '0' } };
  }

  const builtIn: Effect[] = [];
  for (const c of def.cost ?? []) {
    const need = computeActionCost(state, def.id, c.resourceId, toDecimal(c.amount));
    builtIn.push({ kind: 'spendResource', resourceId: c.resourceId, amount: need });
  }
  for (const y of def.yield ?? []) {
    const give = computeActionYield(state, def.id, y.resourceId, toDecimal(y.amount));
    builtIn.push({ kind: 'gainResource', resourceId: y.resourceId, amount: give });
  }
  builtIn.push({ kind: 'incrementClicks', actionId: def.id });

  let next = state;
  const r1 = applyEffects(next, builtIn, defs);
  if (!r1.ok) return r1;
  next = r1.state;

  if (def.onClick && def.onClick.length > 0) {
    const r2 = applyEffects(next, def.onClick, defs);
    if (!r2.ok) return r2;
    next = r2.state;
  }

  if (def.cooldownMs && def.cooldownMs > 0) {
    next = { ...next, cooldowns: { ...next.cooldowns, [def.id]: def.cooldownMs } };
  }

  return { ok: true, state: next };
};

export const purchaseUpgrade = (
  state: GameState,
  upgradeId: string,
  defs: GameDefinition,
): EffectResult => {
  const def = defs.upgrades.find((u) => u.id === upgradeId);
  if (!def) return { ok: false, reason: { reason: 'unknownUpgrade', upgradeId } };
  if (def.purchasableWhen && !evaluateCondition(def.purchasableWhen, state, defs)) {
    return { ok: false, reason: { reason: 'unknownUpgrade', upgradeId } };
  }

  const spend: Effect[] = def.cost.map((c) => ({
    kind: 'spendResource' as const,
    resourceId: c.resourceId,
    amount: c.amount,
  }));

  let next = state;
  const r1 = applyEffects(next, spend, defs);
  if (!r1.ok) return r1;
  next = r1.state;

  return applyEffect(next, { kind: 'purchaseUpgrade', upgradeId }, defs);
};
