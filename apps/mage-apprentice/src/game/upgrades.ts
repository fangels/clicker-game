import { localizedKey, type UpgradeDefinition } from '@clicker-game/engine';

export const upgrades: UpgradeDefinition[] = [
  {
    id: 'cantripsTome',
    name: localizedKey('game:upgrade.cantripsTome.name'),
    description: localizedKey('game:upgrade.cantripsTome.description'),
    cost: [{ resourceId: 'mana', amount: 5 }],
    visibleWhen: { kind: 'storyNodeSeen', nodeId: 'firstReading' },
    purchasableWhen: { kind: 'resourceAtLeast', resourceId: 'mana', amount: 5 },
    effects: [
      {
        kind: 'addModifier',
        modifier: {
          id: 'cantripsTome-mana',
          target: { kind: 'actionYield', actionId: 'studyManuscript', resourceId: 'mana' },
          op: 'add',
          value: 1,
          sourceId: 'cantripsTome',
        },
      },
    ],
  },
  {
    id: 'tomeOfFlames',
    name: localizedKey('game:upgrade.tomeOfFlames.name'),
    description: localizedKey('game:upgrade.tomeOfFlames.description'),
    cost: [{ resourceId: 'arcaneKnowledge', amount: 8 }],
    visibleWhen: { kind: 'storyNodeSeen', nodeId: 'elementsAwaken' },
    purchasableWhen: { kind: 'resourceAtLeast', resourceId: 'arcaneKnowledge', amount: 8 },
    effects: [
      {
        kind: 'addModifier',
        modifier: {
          id: 'tomeOfFlames-cantrip',
          target: { kind: 'actionYield', actionId: 'castCantrip', resourceId: 'arcaneKnowledge' },
          op: 'add',
          value: 1,
          sourceId: 'tomeOfFlames',
        },
      },
    ],
  },
  {
    id: 'tomeOfTides',
    name: localizedKey('game:upgrade.tomeOfTides.name'),
    description: localizedKey('game:upgrade.tomeOfTides.description'),
    cost: [{ resourceId: 'arcaneKnowledge', amount: 8 }],
    visibleWhen: { kind: 'storyNodeSeen', nodeId: 'elementsAwaken' },
    purchasableWhen: { kind: 'resourceAtLeast', resourceId: 'arcaneKnowledge', amount: 8 },
    effects: [
      {
        kind: 'addModifier',
        modifier: {
          id: 'tomeOfTides-study',
          target: { kind: 'actionYield', actionId: 'studyManuscript', resourceId: 'mana' },
          op: 'add',
          value: 1,
          sourceId: 'tomeOfTides',
        },
      },
    ],
  },
  {
    id: 'grimoireOfRunes',
    name: localizedKey('game:upgrade.grimoireOfRunes.name'),
    description: localizedKey('game:upgrade.grimoireOfRunes.description'),
    cost: [
      { resourceId: 'embers', amount: 6 },
      { resourceId: 'frostShards', amount: 6 },
    ],
    visibleWhen: { kind: 'storyNodeSeen', nodeId: 'ancientWhispers' },
    purchasableWhen: {
      kind: 'and',
      all: [
        { kind: 'resourceAtLeast', resourceId: 'embers', amount: 6 },
        { kind: 'resourceAtLeast', resourceId: 'frostShards', amount: 6 },
      ],
    },
    effects: [
      {
        kind: 'addModifier',
        modifier: {
          id: 'grimoireOfRunes-flame',
          target: { kind: 'actionYield', actionId: 'summonFlame', resourceId: 'embers' },
          op: 'add',
          value: 1,
          sourceId: 'grimoireOfRunes',
        },
      },
      {
        kind: 'addModifier',
        modifier: {
          id: 'grimoireOfRunes-frost',
          target: { kind: 'actionYield', actionId: 'conjureFrost', resourceId: 'frostShards' },
          op: 'add',
          value: 1,
          sourceId: 'grimoireOfRunes',
        },
      },
    ],
  },
  {
    id: 'archmageCodex',
    name: localizedKey('game:upgrade.archmageCodex.name'),
    description: localizedKey('game:upgrade.archmageCodex.description'),
    cost: [{ resourceId: 'runicEssence', amount: 10 }],
    visibleWhen: { kind: 'storyNodeSeen', nodeId: 'pathOfTheArchmage' },
    purchasableWhen: { kind: 'resourceAtLeast', resourceId: 'runicEssence', amount: 10 },
    effects: [
      {
        kind: 'addModifier',
        modifier: {
          id: 'archmageCodex-rune',
          target: { kind: 'actionYield', actionId: 'inscribeRune', resourceId: 'runicEssence' },
          op: 'add',
          value: 1,
          sourceId: 'archmageCodex',
        },
      },
    ],
  },
];
