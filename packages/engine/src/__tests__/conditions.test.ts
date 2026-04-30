import { describe, expect, it } from 'vitest';
import { evaluateCondition } from '../conditions.js';
import { createInitialState } from '../initialState.js';
import type { GameDefinition } from '../types/gameDefinition.js';
import { localizedKey } from '../types/i18n.js';

const minimalDef = (): GameDefinition => ({
  meta: { id: 'test', version: '0.0.0', defaultLocale: 'fr', supportedLocales: ['fr'] },
  theme: {
    tokens: {
      colors: { bg: '#000', fg: '#fff', accent: '#0af', muted: '#888', success: '#0a0', danger: '#a00', surface: '#111', border: '#222' },
      fonts: { body: 'serif', display: 'serif', mono: 'monospace' },
      radius: { sm: '2px', md: '4px', lg: '8px' },
      spacing: { xs: '2px', sm: '4px', md: '8px', lg: '16px', xl: '32px' },
    },
  },
  resources: [{ id: 'wood', name: localizedKey('r.wood'), initial: 0 }],
  actions: [{ id: 'chop', label: localizedKey('a.chop'), yield: [{ resourceId: 'wood', amount: 1 }] }],
  upgrades: [],
  quests: [{ id: 'q1', name: localizedKey('q.q1'), completeWhen: { kind: 'resourceAtLeast', resourceId: 'wood', amount: 5 } }],
  story: [],
  messages: { fr: { 'r.wood': 'Bois', 'a.chop': 'Couper', 'q.q1': 'Q1' } },
});

describe('evaluateCondition', () => {
  const defs = minimalDef();
  const base = createInitialState(defs);

  it('always / never', () => {
    expect(evaluateCondition({ kind: 'always' }, base, defs)).toBe(true);
    expect(evaluateCondition({ kind: 'never' }, base, defs)).toBe(false);
  });

  it('resourceAtLeast / AtMost', () => {
    expect(evaluateCondition({ kind: 'resourceAtLeast', resourceId: 'wood', amount: 1 }, base, defs)).toBe(false);
    expect(evaluateCondition({ kind: 'resourceAtMost', resourceId: 'wood', amount: 10 }, base, defs)).toBe(true);
  });

  it('actionClickedAtLeast', () => {
    const state = { ...base, clicks: { chop: 3 } };
    expect(evaluateCondition({ kind: 'actionClickedAtLeast', actionId: 'chop', times: 3 }, state, defs)).toBe(true);
    expect(evaluateCondition({ kind: 'actionClickedAtLeast', actionId: 'chop', times: 4 }, state, defs)).toBe(false);
  });

  it('quest / story / flag', () => {
    const state = {
      ...base,
      quests: { q1: 'completed' as const },
      story: { seen: ['intro'], feed: [] },
      flags: { greeted: true },
    };
    expect(evaluateCondition({ kind: 'questCompleted', questId: 'q1' }, state, defs)).toBe(true);
    expect(evaluateCondition({ kind: 'questActive', questId: 'q1' }, state, defs)).toBe(false);
    expect(evaluateCondition({ kind: 'storyNodeSeen', nodeId: 'intro' }, state, defs)).toBe(true);
    expect(evaluateCondition({ kind: 'flagEquals', key: 'greeted', value: true }, state, defs)).toBe(true);
  });

  it('and / or / not', () => {
    expect(
      evaluateCondition(
        { kind: 'and', all: [{ kind: 'always' }, { kind: 'always' }] },
        base,
        defs,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { kind: 'and', all: [{ kind: 'always' }, { kind: 'never' }] },
        base,
        defs,
      ),
    ).toBe(false);
    expect(
      evaluateCondition(
        { kind: 'or', any: [{ kind: 'never' }, { kind: 'always' }] },
        base,
        defs,
      ),
    ).toBe(true);
    expect(evaluateCondition({ kind: 'not', cond: { kind: 'never' } }, base, defs)).toBe(true);
  });
});
