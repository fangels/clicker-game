import type { Condition } from './condition.js';
import type { Effect } from './effect.js';
import type { StoryNodeId } from './ids.js';
import type { LocalizedKey } from './i18n.js';

export type StoryNodeDefinition = {
  id: StoryNodeId;
  body: LocalizedKey;
  triggerWhen: Condition;
  effects?: Effect[];
};

export type StoryEntry = {
  nodeId: StoryNodeId;
  seenAt: number;
};
