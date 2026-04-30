import { Decimal, ZERO, toDecimal } from './bigNumber.js';
import { getEffectiveCost, getEffectiveYield } from './modifiers.js';
import type { Effect } from './types/effect.js';
import type { GameDefinition } from './types/gameDefinition.js';
import type { GameState } from './types/gameState.js';
import type { ActionId, ResourceId } from './types/ids.js';

export type EffectFailure =
  | { reason: 'insufficientResource'; resourceId: ResourceId; needed: string; available: string }
  | { reason: 'unknownResource'; resourceId: ResourceId }
  | { reason: 'unknownUpgrade'; upgradeId: string }
  | { reason: 'unknownQuest'; questId: string }
  | { reason: 'unknownStoryNode'; nodeId: string }
  | { reason: 'upgradeMaxedOut'; upgradeId: string };

export type EffectResult = { ok: true; state: GameState } | { ok: false; reason: EffectFailure };

const setResource = (state: GameState, resourceId: ResourceId, value: Decimal): GameState => ({
  ...state,
  resources: { ...state.resources, [resourceId]: value },
});

const clampToBounds = (
  defs: GameDefinition,
  resourceId: ResourceId,
  value: Decimal,
): Decimal => {
  const def = defs.resources.find((r) => r.id === resourceId);
  if (!def) return value;
  let result = value;
  if (def.min !== undefined) {
    const lo = toDecimal(def.min);
    if (result.lt(lo)) result = lo;
  }
  if (def.max !== undefined) {
    const hi = toDecimal(def.max);
    if (result.gt(hi)) result = hi;
  }
  return result;
};

export const applyEffect = (
  state: GameState,
  effect: Effect,
  defs: GameDefinition,
): EffectResult => {
  switch (effect.kind) {
    case 'gainResource': {
      const def = defs.resources.find((r) => r.id === effect.resourceId);
      if (!def) return { ok: false, reason: { reason: 'unknownResource', resourceId: effect.resourceId } };
      const current = state.resources[effect.resourceId] ?? ZERO;
      const next = clampToBounds(defs, effect.resourceId, current.add(toDecimal(effect.amount)));
      return { ok: true, state: setResource(state, effect.resourceId, next) };
    }
    case 'spendResource': {
      const def = defs.resources.find((r) => r.id === effect.resourceId);
      if (!def) return { ok: false, reason: { reason: 'unknownResource', resourceId: effect.resourceId } };
      const current = state.resources[effect.resourceId] ?? ZERO;
      const cost = toDecimal(effect.amount);
      if (current.lt(cost)) {
        return {
          ok: false,
          reason: {
            reason: 'insufficientResource',
            resourceId: effect.resourceId,
            needed: cost.toString(),
            available: current.toString(),
          },
        };
      }
      const next = clampToBounds(defs, effect.resourceId, current.sub(cost));
      return { ok: true, state: setResource(state, effect.resourceId, next) };
    }
    case 'setResource': {
      const next = clampToBounds(defs, effect.resourceId, toDecimal(effect.amount));
      return { ok: true, state: setResource(state, effect.resourceId, next) };
    }
    case 'setFlag':
      return { ok: true, state: { ...state, flags: { ...state.flags, [effect.key]: effect.value } } };
    case 'incrementClicks': {
      const by = effect.by ?? 1;
      return {
        ok: true,
        state: {
          ...state,
          clicks: { ...state.clicks, [effect.actionId]: (state.clicks[effect.actionId] ?? 0) + by },
        },
      };
    }
    case 'purchaseUpgrade': {
      const def = defs.upgrades.find((u) => u.id === effect.upgradeId);
      if (!def) return { ok: false, reason: { reason: 'unknownUpgrade', upgradeId: effect.upgradeId } };
      const current = state.upgrades[effect.upgradeId] ?? 0;
      if (def.repeatable === false || def.repeatable === undefined) {
        if (current >= 1) return { ok: false, reason: { reason: 'upgradeMaxedOut', upgradeId: effect.upgradeId } };
      } else if (typeof def.repeatable === 'object') {
        if (current >= def.repeatable.max)
          return { ok: false, reason: { reason: 'upgradeMaxedOut', upgradeId: effect.upgradeId } };
      }
      let next: GameState = {
        ...state,
        upgrades: { ...state.upgrades, [effect.upgradeId]: current + 1 },
      };
      for (const e of def.effects) {
        const r = applyEffect(next, e, defs);
        if (!r.ok) return r;
        next = r.state;
      }
      return { ok: true, state: next };
    }
    case 'startQuest': {
      const def = defs.quests.find((q) => q.id === effect.questId);
      if (!def) return { ok: false, reason: { reason: 'unknownQuest', questId: effect.questId } };
      return {
        ok: true,
        state: { ...state, quests: { ...state.quests, [effect.questId]: 'active' } },
      };
    }
    case 'completeQuest': {
      const def = defs.quests.find((q) => q.id === effect.questId);
      if (!def) return { ok: false, reason: { reason: 'unknownQuest', questId: effect.questId } };
      let next: GameState = {
        ...state,
        quests: { ...state.quests, [effect.questId]: 'completed' },
      };
      for (const e of def.rewards ?? []) {
        const r = applyEffect(next, e, defs);
        if (!r.ok) return r;
        next = r.state;
      }
      return { ok: true, state: next };
    }
    case 'failQuest': {
      const def = defs.quests.find((q) => q.id === effect.questId);
      if (!def) return { ok: false, reason: { reason: 'unknownQuest', questId: effect.questId } };
      return {
        ok: true,
        state: { ...state, quests: { ...state.quests, [effect.questId]: 'failed' } },
      };
    }
    case 'advanceStory': {
      const def = defs.story.find((s) => s.id === effect.nodeId);
      if (!def) return { ok: false, reason: { reason: 'unknownStoryNode', nodeId: effect.nodeId } };
      if (state.story.seen.includes(effect.nodeId)) return { ok: true, state };
      let next: GameState = {
        ...state,
        story: {
          seen: [...state.story.seen, effect.nodeId],
          feed: [...state.story.feed, { nodeId: effect.nodeId, seenAt: state.lastTickAt }],
        },
      };
      for (const e of def.effects ?? []) {
        const r = applyEffect(next, e, defs);
        if (!r.ok) return r;
        next = r.state;
      }
      return { ok: true, state: next };
    }
    case 'addModifier':
      return { ok: true, state: { ...state, modifiers: [...state.modifiers, effect.modifier] } };
    case 'removeModifierBySource':
      return {
        ok: true,
        state: { ...state, modifiers: state.modifiers.filter((m) => m.sourceId !== effect.sourceId) },
      };
  }
};

export const applyEffects = (
  state: GameState,
  effects: Effect[],
  defs: GameDefinition,
): EffectResult => {
  let current: GameState = state;
  for (const e of effects) {
    const r = applyEffect(current, e, defs);
    if (!r.ok) return r;
    current = r.state;
  }
  return { ok: true, state: current };
};

export const computeActionCost = (
  state: GameState,
  actionId: ActionId,
  resourceId: ResourceId,
  base: Decimal,
): Decimal => getEffectiveCost(base, state, actionId, resourceId);

export const computeActionYield = (
  state: GameState,
  actionId: ActionId,
  resourceId: ResourceId,
  base: Decimal,
): Decimal => getEffectiveYield(base, state, actionId, resourceId);
