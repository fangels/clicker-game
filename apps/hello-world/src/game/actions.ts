import { localizedKey, type ActionDefinition } from '@clicker-game/engine';

export const actions: ActionDefinition[] = [
  {
    id: 'chopWood',
    label: localizedKey('game:action.chopWood.label'),
    description: localizedKey('game:action.chopWood.description'),
    yield: [{ resourceId: 'wood', amount: 1 }],
  },
  {
    id: 'reflect',
    label: localizedKey('game:action.reflect.label'),
    description: localizedKey('game:action.reflect.description'),
    cost: [{ resourceId: 'wood', amount: 3 }],
    yield: [{ resourceId: 'insight', amount: 1 }],
    visibleWhen: { kind: 'storyNodeSeen', nodeId: 'intro' },
    enabledWhen: { kind: 'resourceAtLeast', resourceId: 'wood', amount: 3 },
  },
];
