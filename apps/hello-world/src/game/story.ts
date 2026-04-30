import { localizedKey, type StoryNodeDefinition } from '@clicker-game/engine';

export const story: StoryNodeDefinition[] = [
  {
    id: 'intro',
    body: localizedKey('game:story.intro.body'),
    triggerWhen: { kind: 'always' },
  },
  {
    id: 'reward',
    body: localizedKey('game:story.reward.body'),
    triggerWhen: { kind: 'questCompleted', questId: 'firstInsight' },
  },
];
