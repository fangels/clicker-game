import { Decimal, ONE, toDecimal, ZERO } from './bigNumber.js';
import type { ActionId, ResourceId } from './types/ids.js';
import type { Modifier } from './types/modifier.js';
import type { GameState } from './types/gameState.js';

const matchesYield = (m: Modifier, actionId: ActionId, resourceId: ResourceId): boolean =>
  m.target.kind === 'actionYield' &&
  m.target.actionId === actionId &&
  m.target.resourceId === resourceId;

const matchesCost = (m: Modifier, actionId: ActionId, resourceId: ResourceId): boolean =>
  m.target.kind === 'actionCost' &&
  m.target.actionId === actionId &&
  m.target.resourceId === resourceId;

const matchesTickRate = (m: Modifier, resourceId: ResourceId): boolean =>
  m.target.kind === 'tickRate' && m.target.resourceId === resourceId;

const applyModifiers = (base: Decimal, mods: Modifier[]): Decimal => {
  let value = base;
  for (const m of mods) {
    if (m.op === 'add') value = value.add(m.value);
  }
  for (const m of mods) {
    if (m.op === 'mul') value = value.mul(m.value);
  }
  return value;
};

export const getEffectiveYield = (
  base: Decimal,
  state: GameState,
  actionId: ActionId,
  resourceId: ResourceId,
): Decimal => applyModifiers(base, state.modifiers.filter((m) => matchesYield(m, actionId, resourceId)));

export const getEffectiveCost = (
  base: Decimal,
  state: GameState,
  actionId: ActionId,
  resourceId: ResourceId,
): Decimal => {
  const result = applyModifiers(
    base,
    state.modifiers.filter((m) => matchesCost(m, actionId, resourceId)),
  );
  return result.lt(ZERO) ? ZERO : result;
};

export const getEffectiveTickRate = (state: GameState, resourceId: ResourceId): Decimal => {
  const mods = state.modifiers.filter((m) => matchesTickRate(m, resourceId));
  if (mods.length === 0) return ZERO;
  return applyModifiers(ZERO, mods);
};

export const removeModifiersBySource = (state: GameState, sourceId: string): Modifier[] =>
  state.modifiers.filter((m) => m.sourceId !== sourceId);

export { applyModifiers, ONE, toDecimal };
