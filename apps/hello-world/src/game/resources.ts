import { localizedKey, type ResourceDefinition } from '@clicker-game/engine';

export const resources: ResourceDefinition[] = [
  {
    id: 'wood',
    name: localizedKey('game:resource.wood.name'),
    description: localizedKey('game:resource.wood.description'),
    initial: 0,
  },
  {
    id: 'insight',
    name: localizedKey('game:resource.insight.name'),
    description: localizedKey('game:resource.insight.description'),
    initial: 0,
    visibleWhen: { kind: 'resourceAtLeast', resourceId: 'wood', amount: 5 },
  },
];
