import type { Condition } from './types/condition.js';
import type { Effect } from './types/effect.js';
import type { GameDefinition } from './types/gameDefinition.js';

const collectKeysFromCondition = (cond: Condition, sink: Set<string>): void => {
  switch (cond.kind) {
    case 'and':
      cond.all.forEach((c) => collectKeysFromCondition(c, sink));
      return;
    case 'or':
      cond.any.forEach((c) => collectKeysFromCondition(c, sink));
      return;
    case 'not':
      collectKeysFromCondition(cond.cond, sink);
      return;
    default:
      return;
  }
};

const collectKeysFromEffect = (_effect: Effect, _sink: Set<string>): void => {
  // Effects do not embed user-facing strings.
};

export const collectI18nKeys = (defs: GameDefinition): string[] => {
  const sink = new Set<string>();
  for (const r of defs.resources) {
    sink.add(r.name);
    if (r.description) sink.add(r.description);
  }
  for (const a of defs.actions) {
    sink.add(a.label);
    if (a.description) sink.add(a.description);
    if (a.visibleWhen) collectKeysFromCondition(a.visibleWhen, sink);
    if (a.enabledWhen) collectKeysFromCondition(a.enabledWhen, sink);
    (a.onClick ?? []).forEach((e) => collectKeysFromEffect(e, sink));
  }
  for (const u of defs.upgrades) {
    sink.add(u.name);
    if (u.description) sink.add(u.description);
  }
  for (const q of defs.quests) {
    sink.add(q.name);
    if (q.description) sink.add(q.description);
  }
  for (const s of defs.story) {
    sink.add(s.body);
  }
  return Array.from(sink);
};

export type ValidationError = {
  path: string;
  message: string;
};

const checkUnique = (label: string, ids: string[], errors: ValidationError[]): void => {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) errors.push({ path: label, message: `duplicate id "${id}"` });
    seen.add(id);
  }
};

const checkConditionRefs = (
  cond: Condition,
  defs: GameDefinition,
  path: string,
  errors: ValidationError[],
): void => {
  switch (cond.kind) {
    case 'resourceAtLeast':
    case 'resourceAtMost':
      if (!defs.resources.find((r) => r.id === cond.resourceId))
        errors.push({ path, message: `unknown resourceId "${cond.resourceId}"` });
      return;
    case 'actionClickedAtLeast':
      if (!defs.actions.find((a) => a.id === cond.actionId))
        errors.push({ path, message: `unknown actionId "${cond.actionId}"` });
      return;
    case 'upgradePurchased':
      if (!defs.upgrades.find((u) => u.id === cond.upgradeId))
        errors.push({ path, message: `unknown upgradeId "${cond.upgradeId}"` });
      return;
    case 'questActive':
    case 'questCompleted':
      if (!defs.quests.find((q) => q.id === cond.questId))
        errors.push({ path, message: `unknown questId "${cond.questId}"` });
      return;
    case 'storyNodeSeen':
      if (!defs.story.find((s) => s.id === cond.nodeId))
        errors.push({ path, message: `unknown storyNodeId "${cond.nodeId}"` });
      return;
    case 'and':
      cond.all.forEach((c, i) => checkConditionRefs(c, defs, `${path}.all[${i}]`, errors));
      return;
    case 'or':
      cond.any.forEach((c, i) => checkConditionRefs(c, defs, `${path}.any[${i}]`, errors));
      return;
    case 'not':
      checkConditionRefs(cond.cond, defs, `${path}.cond`, errors);
      return;
    default:
      return;
  }
};

const checkEffectRefs = (
  effect: Effect,
  defs: GameDefinition,
  path: string,
  errors: ValidationError[],
): void => {
  switch (effect.kind) {
    case 'gainResource':
    case 'spendResource':
    case 'setResource':
      if (!defs.resources.find((r) => r.id === effect.resourceId))
        errors.push({ path, message: `unknown resourceId "${effect.resourceId}"` });
      return;
    case 'purchaseUpgrade':
      if (!defs.upgrades.find((u) => u.id === effect.upgradeId))
        errors.push({ path, message: `unknown upgradeId "${effect.upgradeId}"` });
      return;
    case 'startQuest':
    case 'completeQuest':
    case 'failQuest':
      if (!defs.quests.find((q) => q.id === effect.questId))
        errors.push({ path, message: `unknown questId "${effect.questId}"` });
      return;
    case 'advanceStory':
      if (!defs.story.find((s) => s.id === effect.nodeId))
        errors.push({ path, message: `unknown storyNodeId "${effect.nodeId}"` });
      return;
    default:
      return;
  }
};

export const validateGameDefinition = (defs: GameDefinition): ValidationError[] => {
  const errors: ValidationError[] = [];

  checkUnique('resources', defs.resources.map((r) => r.id), errors);
  checkUnique('actions', defs.actions.map((a) => a.id), errors);
  checkUnique('upgrades', defs.upgrades.map((u) => u.id), errors);
  checkUnique('quests', defs.quests.map((q) => q.id), errors);
  checkUnique('story', defs.story.map((s) => s.id), errors);

  defs.resources.forEach((r, i) => {
    if (r.visibleWhen)
      checkConditionRefs(r.visibleWhen, defs, `resources[${i}].visibleWhen`, errors);
  });
  defs.actions.forEach((a, i) => {
    (a.cost ?? []).forEach((c, j) => {
      if (!defs.resources.find((r) => r.id === c.resourceId))
        errors.push({ path: `actions[${i}].cost[${j}]`, message: `unknown resourceId "${c.resourceId}"` });
    });
    (a.yield ?? []).forEach((y, j) => {
      if (!defs.resources.find((r) => r.id === y.resourceId))
        errors.push({ path: `actions[${i}].yield[${j}]`, message: `unknown resourceId "${y.resourceId}"` });
    });
    if (a.visibleWhen) checkConditionRefs(a.visibleWhen, defs, `actions[${i}].visibleWhen`, errors);
    if (a.enabledWhen) checkConditionRefs(a.enabledWhen, defs, `actions[${i}].enabledWhen`, errors);
    (a.onClick ?? []).forEach((e, j) =>
      checkEffectRefs(e, defs, `actions[${i}].onClick[${j}]`, errors),
    );
  });
  defs.upgrades.forEach((u, i) => {
    u.cost.forEach((c, j) => {
      if (!defs.resources.find((r) => r.id === c.resourceId))
        errors.push({ path: `upgrades[${i}].cost[${j}]`, message: `unknown resourceId "${c.resourceId}"` });
    });
    u.effects.forEach((e, j) => checkEffectRefs(e, defs, `upgrades[${i}].effects[${j}]`, errors));
    if (u.visibleWhen) checkConditionRefs(u.visibleWhen, defs, `upgrades[${i}].visibleWhen`, errors);
    if (u.purchasableWhen)
      checkConditionRefs(u.purchasableWhen, defs, `upgrades[${i}].purchasableWhen`, errors);
  });
  defs.quests.forEach((q, i) => {
    if (q.startWhen) checkConditionRefs(q.startWhen, defs, `quests[${i}].startWhen`, errors);
    if (q.failWhen) checkConditionRefs(q.failWhen, defs, `quests[${i}].failWhen`, errors);
    checkConditionRefs(q.completeWhen, defs, `quests[${i}].completeWhen`, errors);
    (q.rewards ?? []).forEach((e, j) =>
      checkEffectRefs(e, defs, `quests[${i}].rewards[${j}]`, errors),
    );
  });
  defs.story.forEach((s, i) => {
    checkConditionRefs(s.triggerWhen, defs, `story[${i}].triggerWhen`, errors);
    (s.effects ?? []).forEach((e, j) =>
      checkEffectRefs(e, defs, `story[${i}].effects[${j}]`, errors),
    );
  });

  const referenceLocale = defs.meta.defaultLocale;
  const referenceMessages = defs.messages[referenceLocale];
  if (!referenceMessages) {
    errors.push({
      path: `messages.${referenceLocale}`,
      message: `default locale "${referenceLocale}" missing from messages`,
    });
  } else {
    const keys = collectI18nKeys(defs);
    for (const key of keys) {
      if (!(key in referenceMessages)) {
        errors.push({
          path: `messages.${referenceLocale}`,
          message: `missing translation key "${key}"`,
        });
      }
    }
  }

  return errors;
};

export const assertValidGameDefinition = (defs: GameDefinition): void => {
  const errors = validateGameDefinition(defs);
  if (errors.length > 0) {
    const summary = errors.map((e) => `  - ${e.path}: ${e.message}`).join('\n');
    throw new Error(`Invalid GameDefinition:\n${summary}`);
  }
};
