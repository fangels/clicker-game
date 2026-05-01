import { localizedKey, type ResourceDefinition } from '@clicker-game/engine';

export const resources: ResourceDefinition[] = [
  {
    id: 'mana',
    name: localizedKey('game:resource.mana.name'),
    description: localizedKey('game:resource.mana.description'),
    initial: 0,
  },
  {
    id: 'arcaneKnowledge',
    name: localizedKey('game:resource.arcaneKnowledge.name'),
    description: localizedKey('game:resource.arcaneKnowledge.description'),
    initial: 0,
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'cantripsTome' },
  },
  {
    id: 'embers',
    name: localizedKey('game:resource.embers.name'),
    description: localizedKey('game:resource.embers.description'),
    initial: 0,
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'tomeOfFlames' },
  },
  {
    id: 'frostShards',
    name: localizedKey('game:resource.frostShards.name'),
    description: localizedKey('game:resource.frostShards.description'),
    initial: 0,
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'tomeOfTides' },
  },
  {
    id: 'runicEssence',
    name: localizedKey('game:resource.runicEssence.name'),
    description: localizedKey('game:resource.runicEssence.description'),
    initial: 0,
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'grimoireOfRunes' },
  },
  {
    id: 'wisdom',
    name: localizedKey('game:resource.wisdom.name'),
    description: localizedKey('game:resource.wisdom.description'),
    initial: 0,
    visibleWhen: { kind: 'upgradePurchased', upgradeId: 'archmageCodex' },
  },
];
