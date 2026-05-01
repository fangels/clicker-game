import { localizedKey, type StoryNodeDefinition } from '@clicker-game/engine';

export const story: StoryNodeDefinition[] = [
  {
    id: 'intro',
    body: localizedKey('game:story.intro.body'),
    triggerWhen: { kind: 'always' },
  },
  {
    id: 'firstReading',
    body: localizedKey('game:story.firstReading.body'),
    triggerWhen: { kind: 'resourceAtLeast', resourceId: 'mana', amount: 3 },
  },
  {
    id: 'cantripCast',
    body: localizedKey('game:story.cantripCast.body'),
    triggerWhen: { kind: 'resourceAtLeast', resourceId: 'arcaneKnowledge', amount: 1 },
  },
  {
    id: 'elementsAwaken',
    body: localizedKey('game:story.elementsAwaken.body'),
    triggerWhen: { kind: 'questCompleted', questId: 'cantripMastery' },
  },
  {
    id: 'flamesIgnite',
    body: localizedKey('game:story.flamesIgnite.body'),
    triggerWhen: { kind: 'resourceAtLeast', resourceId: 'embers', amount: 1 },
  },
  {
    id: 'wavesEcho',
    body: localizedKey('game:story.wavesEcho.body'),
    triggerWhen: { kind: 'resourceAtLeast', resourceId: 'frostShards', amount: 1 },
  },
  {
    id: 'ancientWhispers',
    body: localizedKey('game:story.ancientWhispers.body'),
    triggerWhen: { kind: 'questCompleted', questId: 'elementalAttunement' },
  },
  {
    id: 'mastersGhost',
    body: localizedKey('game:story.mastersGhost.body'),
    triggerWhen: { kind: 'resourceAtLeast', resourceId: 'runicEssence', amount: 5 },
  },
  {
    id: 'pathOfTheArchmage',
    body: localizedKey('game:story.pathOfTheArchmage.body'),
    triggerWhen: { kind: 'questCompleted', questId: 'runicAdept' },
  },
  {
    id: 'newDawn',
    body: localizedKey('game:story.newDawn.body'),
    triggerWhen: { kind: 'questCompleted', questId: 'archmageAscension' },
  },
];
