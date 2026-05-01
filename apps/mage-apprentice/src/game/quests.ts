import { localizedKey, type QuestDefinition } from '@clicker-game/engine';

export const quests: QuestDefinition[] = [
  {
    id: 'firstSpell',
    name: localizedKey('game:quest.firstSpell.name'),
    description: localizedKey('game:quest.firstSpell.description'),
    completeWhen: { kind: 'resourceAtLeast', resourceId: 'arcaneKnowledge', amount: 1 },
    rewards: [{ kind: 'setFlag', key: 'firstSpellCast', value: true }],
  },
  {
    id: 'cantripMastery',
    name: localizedKey('game:quest.cantripMastery.name'),
    description: localizedKey('game:quest.cantripMastery.description'),
    startWhen: { kind: 'questCompleted', questId: 'firstSpell' },
    completeWhen: { kind: 'resourceAtLeast', resourceId: 'arcaneKnowledge', amount: 5 },
    rewards: [{ kind: 'setFlag', key: 'cantripsMastered', value: true }],
  },
  {
    id: 'elementalAttunement',
    name: localizedKey('game:quest.elementalAttunement.name'),
    description: localizedKey('game:quest.elementalAttunement.description'),
    startWhen: { kind: 'storyNodeSeen', nodeId: 'elementsAwaken' },
    completeWhen: {
      kind: 'and',
      all: [
        { kind: 'resourceAtLeast', resourceId: 'embers', amount: 3 },
        { kind: 'resourceAtLeast', resourceId: 'frostShards', amount: 3 },
      ],
    },
    rewards: [{ kind: 'setFlag', key: 'elementalist', value: true }],
  },
  {
    id: 'runicAdept',
    name: localizedKey('game:quest.runicAdept.name'),
    description: localizedKey('game:quest.runicAdept.description'),
    startWhen: { kind: 'upgradePurchased', upgradeId: 'grimoireOfRunes' },
    completeWhen: { kind: 'resourceAtLeast', resourceId: 'runicEssence', amount: 5 },
    rewards: [{ kind: 'setFlag', key: 'runicAdept', value: true }],
  },
  {
    id: 'archmageAscension',
    name: localizedKey('game:quest.archmageAscension.name'),
    description: localizedKey('game:quest.archmageAscension.description'),
    startWhen: { kind: 'upgradePurchased', upgradeId: 'archmageCodex' },
    completeWhen: { kind: 'resourceAtLeast', resourceId: 'wisdom', amount: 1 },
    rewards: [{ kind: 'setFlag', key: 'archmage', value: true }],
  },
];
