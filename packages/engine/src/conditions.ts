import { toDecimal } from './bigNumber.js';
import type { Condition } from './types/condition.js';
import type { GameDefinition } from './types/gameDefinition.js';
import type { GameState } from './types/gameState.js';

export const evaluateCondition = (
  cond: Condition,
  state: GameState,
  _defs: GameDefinition,
): boolean => {
  switch (cond.kind) {
    case 'always':
      return true;
    case 'never':
      return false;
    case 'resourceAtLeast': {
      const value = state.resources[cond.resourceId];
      if (!value) return toDecimal(cond.amount).lte(0);
      return value.gte(toDecimal(cond.amount));
    }
    case 'resourceAtMost': {
      const value = state.resources[cond.resourceId];
      if (!value) return true;
      return value.lte(toDecimal(cond.amount));
    }
    case 'actionClickedAtLeast': {
      const clicks = state.clicks[cond.actionId] ?? 0;
      return clicks >= cond.times;
    }
    case 'upgradePurchased': {
      const count = state.upgrades[cond.upgradeId] ?? 0;
      return count >= (cond.atLeast ?? 1);
    }
    case 'questActive':
      return state.quests[cond.questId] === 'active';
    case 'questCompleted':
      return state.quests[cond.questId] === 'completed';
    case 'storyNodeSeen':
      return state.story.seen.includes(cond.nodeId);
    case 'flagEquals':
      return state.flags[cond.key] === cond.value;
    case 'and':
      return cond.all.every((c) => evaluateCondition(c, state, _defs));
    case 'or':
      return cond.any.some((c) => evaluateCondition(c, state, _defs));
    case 'not':
      return !evaluateCondition(cond.cond, state, _defs);
  }
};
