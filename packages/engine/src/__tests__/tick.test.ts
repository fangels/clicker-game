import { describe, expect, it } from 'vitest';
import { tick } from '../tick.js';
import { createInitialState } from '../initialState.js';
import type { GameDefinition } from '../types/gameDefinition.js';
import { localizedKey } from '../types/i18n.js';

const defs: GameDefinition = {
  meta: { id: 't', version: '0', defaultLocale: 'fr', supportedLocales: ['fr'] },
  theme: {
    tokens: {
      colors: { bg: '#000', fg: '#fff', accent: '#0af', muted: '#888', success: '#0a0', danger: '#a00', surface: '#111', border: '#222' },
      fonts: { body: 's', display: 's', mono: 'm' },
      radius: { sm: '2px', md: '4px', lg: '8px' },
      spacing: { xs: '2px', sm: '4px', md: '8px', lg: '16px', xl: '32px' },
    },
  },
  resources: [{ id: 'wood', name: localizedKey('r.wood'), initial: 0 }],
  actions: [],
  upgrades: [],
  quests: [
    {
      id: 'q1',
      name: localizedKey('q.q1'),
      completeWhen: { kind: 'resourceAtLeast', resourceId: 'wood', amount: 5 },
    },
  ],
  story: [{ id: 'intro', body: localizedKey('s.intro'), triggerWhen: { kind: 'always' } }],
  messages: { fr: { 'r.wood': 'Bois', 'q.q1': 'Q1', 's.intro': 'intro' } },
};

describe('tick', () => {
  it('triggers always-condition story node on first tick', () => {
    const state = createInitialState(defs);
    const after = tick(state, 100, defs);
    expect(after.story.seen).toContain('intro');
  });

  it('decrements cooldowns and removes expired ones', () => {
    const state = { ...createInitialState(defs), cooldowns: { x: 50, y: 200 } };
    const after = tick(state, 100, defs);
    expect(after.cooldowns.x).toBeUndefined();
    expect(after.cooldowns.y).toBe(100);
  });

  it('applies passive yield from tickRate modifiers', () => {
    const state = {
      ...createInitialState(defs),
      modifiers: [
        {
          id: 'gen',
          target: { kind: 'tickRate' as const, resourceId: 'wood' },
          op: 'add' as const,
          value: 10,
        },
      ],
    };
    const after = tick(state, 1000, defs);
    expect(after.resources.wood?.toNumber()).toBeCloseTo(10);
  });

  it('completes a quest when its condition becomes true', () => {
    let state = createInitialState(defs);
    state = {
      ...state,
      modifiers: [
        {
          id: 'gen',
          target: { kind: 'tickRate' as const, resourceId: 'wood' },
          op: 'add' as const,
          value: 100,
        },
      ],
    };
    const after = tick(state, 1000, defs);
    expect(after.quests.q1).toBe('completed');
  });
});
