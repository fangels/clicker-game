import { toDecimal, ZERO } from './bigNumber.js';
import { evaluateCondition } from './conditions.js';
import { applyEffect, applyEffects, type EffectResult } from './effects.js';
import { getEffectiveTickRate } from './modifiers.js';
import type { GameDefinition } from './types/gameDefinition.js';
import type { GameState } from './types/gameState.js';

const decrementCooldowns = (state: GameState, dtMs: number): GameState => {
  const next: Record<string, number> = {};
  let changed = false;
  for (const [id, cd] of Object.entries(state.cooldowns)) {
    const remaining = cd - dtMs;
    if (remaining > 0) {
      next[id] = remaining;
      if (remaining !== cd) changed = true;
    } else {
      changed = true;
    }
  }
  return changed ? { ...state, cooldowns: next } : state;
};

const applyPassiveYield = (state: GameState, defs: GameDefinition, dtMs: number): GameState => {
  const dtSec = dtMs / 1000;
  let result = state;
  for (const r of defs.resources) {
    const ratePerSec = getEffectiveTickRate(result, r.id);
    if (ratePerSec.eq(ZERO)) continue;
    const delta = ratePerSec.mul(dtSec);
    if (delta.eq(ZERO)) continue;
    const out = applyEffect(result, { kind: 'gainResource', resourceId: r.id, amount: delta }, defs);
    if (out.ok) result = out.state;
  }
  return result;
};

const evaluateQuests = (state: GameState, defs: GameDefinition): GameState => {
  let result = state;
  for (const q of defs.quests) {
    const status = result.quests[q.id] ?? 'inactive';
    if (status === 'inactive' && q.startWhen && evaluateCondition(q.startWhen, result, defs)) {
      const r = applyEffect(result, { kind: 'startQuest', questId: q.id }, defs);
      if (r.ok) result = r.state;
    }
    const refreshedStatus = result.quests[q.id] ?? 'inactive';
    if (refreshedStatus === 'active' || (refreshedStatus === 'inactive' && !q.startWhen)) {
      if (q.failWhen && evaluateCondition(q.failWhen, result, defs)) {
        const r = applyEffect(result, { kind: 'failQuest', questId: q.id }, defs);
        if (r.ok) result = r.state;
        continue;
      }
      if (evaluateCondition(q.completeWhen, result, defs)) {
        const r = applyEffect(result, { kind: 'completeQuest', questId: q.id }, defs);
        if (r.ok) result = r.state;
      }
    }
  }
  return result;
};

const evaluateStory = (state: GameState, defs: GameDefinition): GameState => {
  let result = state;
  for (const node of defs.story) {
    if (result.story.seen.includes(node.id)) continue;
    if (!evaluateCondition(node.triggerWhen, result, defs)) continue;
    const r = applyEffect(result, { kind: 'advanceStory', nodeId: node.id }, defs);
    if (r.ok) result = r.state;
  }
  return result;
};

export const tick = (state: GameState, dtMs: number, defs: GameDefinition): GameState => {
  let next = state;
  next = decrementCooldowns(next, dtMs);
  next = applyPassiveYield(next, defs, dtMs);
  next = evaluateQuests(next, defs);
  next = evaluateStory(next, defs);
  next = { ...next, lastTickAt: next.lastTickAt + dtMs };
  return next;
};

export { applyEffects, type EffectResult };
export { toDecimal };
