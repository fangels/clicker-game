import { localizedKey, type QuestDefinition } from '@clicker-game/engine';

export const quests: QuestDefinition[] = [
  {
    id: 'firstInsight',
    name: localizedKey('game:quest.firstInsight.name'),
    description: localizedKey('game:quest.firstInsight.description'),
    completeWhen: { kind: 'resourceAtLeast', resourceId: 'insight', amount: 1 },
    rewards: [
      { kind: 'setFlag', key: 'insightful', value: true },
      { kind: 'advanceStory', nodeId: 'reward' },
    ],
  },
];
