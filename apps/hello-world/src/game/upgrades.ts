import { localizedKey, type UpgradeDefinition } from '@clicker-game/engine';

export const upgrades: UpgradeDefinition[] = [
  {
    id: 'betterAxe',
    name: localizedKey('game:upgrade.betterAxe.name'),
    description: localizedKey('game:upgrade.betterAxe.description'),
    cost: [{ resourceId: 'wood', amount: 10 }],
    visibleWhen: { kind: 'resourceAtLeast', resourceId: 'wood', amount: 5 },
    purchasableWhen: { kind: 'resourceAtLeast', resourceId: 'wood', amount: 10 },
    effects: [
      {
        kind: 'addModifier',
        modifier: {
          id: 'betterAxe-yield',
          target: { kind: 'actionYield', actionId: 'chopWood', resourceId: 'wood' },
          op: 'add',
          value: 1,
          sourceId: 'betterAxe',
        },
      },
    ],
  },
];
