import { localizedKey, type ActionDefinition } from '@clicker-game/engine';

export const actions: ActionDefinition[] = [
  {
    id: 'studyManuscript',
    label: localizedKey('game:action.studyManuscript.label'),
    description: localizedKey('game:action.studyManuscript.description'),
    yield: [{ resourceId: 'mana', amount: 1 }],
  },
  {
    id: 'castCantrip',
    label: localizedKey('game:action.castCantrip.label'),
    description: localizedKey('game:action.castCantrip.description'),
    cost: [{ resourceId: 'mana', amount: 3 }],
    yield: [{ resourceId: 'arcaneKnowledge', amount: 1 }],
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'cantripsTome' },
    enabledWhen: { kind: 'resourceAtLeast', resourceId: 'mana', amount: 3 },
  },
  {
    id: 'summonFlame',
    label: localizedKey('game:action.summonFlame.label'),
    description: localizedKey('game:action.summonFlame.description'),
    cost: [{ resourceId: 'arcaneKnowledge', amount: 2 }],
    yield: [{ resourceId: 'embers', amount: 1 }],
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'tomeOfFlames' },
    enabledWhen: { kind: 'resourceAtLeast', resourceId: 'arcaneKnowledge', amount: 2 },
  },
  {
    id: 'conjureFrost',
    label: localizedKey('game:action.conjureFrost.label'),
    description: localizedKey('game:action.conjureFrost.description'),
    cost: [{ resourceId: 'arcaneKnowledge', amount: 2 }],
    yield: [{ resourceId: 'frostShards', amount: 1 }],
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'tomeOfTides' },
    enabledWhen: { kind: 'resourceAtLeast', resourceId: 'arcaneKnowledge', amount: 2 },
  },
  {
    id: 'inscribeRune',
    label: localizedKey('game:action.inscribeRune.label'),
    description: localizedKey('game:action.inscribeRune.description'),
    cost: [
      { resourceId: 'embers', amount: 1 },
      { resourceId: 'frostShards', amount: 1 },
    ],
    yield: [{ resourceId: 'runicEssence', amount: 1 }],
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'grimoireOfRunes' },
    enabledWhen: {
      kind: 'and',
      all: [
        { kind: 'resourceAtLeast', resourceId: 'embers', amount: 1 },
        { kind: 'resourceAtLeast', resourceId: 'frostShards', amount: 1 },
      ],
    },
  },
  {
    id: 'transcribeKnowledge',
    label: localizedKey('game:action.transcribeKnowledge.label'),
    description: localizedKey('game:action.transcribeKnowledge.description'),
    cost: [
      { resourceId: 'mana', amount: 10 },
      { resourceId: 'arcaneKnowledge', amount: 5 },
      { resourceId: 'runicEssence', amount: 3 },
    ],
    yield: [{ resourceId: 'wisdom', amount: 1 }],
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'archmageCodex' },
    enabledWhen: {
      kind: 'and',
      all: [
        { kind: 'resourceAtLeast', resourceId: 'mana', amount: 10 },
        { kind: 'resourceAtLeast', resourceId: 'arcaneKnowledge', amount: 5 },
        { kind: 'resourceAtLeast', resourceId: 'runicEssence', amount: 3 },
      ],
    },
  },
];
