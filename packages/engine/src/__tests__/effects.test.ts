import { describe, expect, it } from 'vitest';
import { applyEffect, applyEffects } from '../effects.js';
import { createInitialState } from '../initialState.js';
import type { GameDefinition } from '../types/gameDefinition.js';
import { localizedKey } from '../types/i18n.js';
import { toDecimal } from '../bigNumber.js';

const defs: GameDefinition = {
  meta: { id: 't', version: '0.0.0', defaultLocale: 'fr', supportedLocales: ['fr'] },
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
  upgrades: [
    {
      id: 'axe',
      name: localizedKey('u.axe'),
      cost: [{ resourceId: 'wood', amount: 5 }],
      effects: [
        {
          kind: 'addModifier',
          modifier: {
            id: 'axe-bonus',
            target: { kind: 'actionYield', actionId: 'chop', resourceId: 'wood' },
            op: 'add',
            value: 1,
            sourceId: 'axe',
          },
        },
      ],
    },
  ],
  quests: [
    {
      id: 'q1',
      name: localizedKey('q.q1'),
      completeWhen: { kind: 'always' },
      rewards: [{ kind: 'setFlag', key: 'won', value: true }],
    },
  ],
  story: [{ id: 'intro', body: localizedKey('s.intro'), triggerWhen: { kind: 'always' } }],
  messages: { fr: { 'r.wood': 'Bois', 'u.axe': 'Hache', 'q.q1': 'Q1', 's.intro': 'intro' } },
};

describe('applyEffect', () => {
  const base = createInitialState(defs);

  it('gainResource then spendResource', () => {
    const r1 = applyEffect(base, { kind: 'gainResource', resourceId: 'wood', amount: 10 }, defs);
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    expect(r1.state.resources.wood?.toNumber()).toBe(10);

    const r2 = applyEffect(r1.state, { kind: 'spendResource', resourceId: 'wood', amount: 3 }, defs);
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(r2.state.resources.wood?.toNumber()).toBe(7);
  });

  it('spendResource fails when insufficient', () => {
    const r = applyEffect(base, { kind: 'spendResource', resourceId: 'wood', amount: 1 }, defs);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason.reason).toBe('insufficientResource');
  });

  it('purchaseUpgrade adds modifier', () => {
    let state = base;
    const r1 = applyEffect(state, { kind: 'gainResource', resourceId: 'wood', amount: 10 }, defs);
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    state = r1.state;
    const r2 = applyEffect(state, { kind: 'purchaseUpgrade', upgradeId: 'axe' }, defs);
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(r2.state.modifiers.length).toBe(1);
    expect(r2.state.upgrades.axe).toBe(1);
  });

  it('completeQuest applies rewards', () => {
    const r = applyEffect(base, { kind: 'completeQuest', questId: 'q1' }, defs);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.state.quests.q1).toBe('completed');
    expect(r.state.flags.won).toBe(true);
  });

  it('advanceStory pushes feed entry; second call no-op', () => {
    const r1 = applyEffect(base, { kind: 'advanceStory', nodeId: 'intro' }, defs);
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    expect(r1.state.story.seen).toEqual(['intro']);
    const r2 = applyEffect(r1.state, { kind: 'advanceStory', nodeId: 'intro' }, defs);
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(r2.state.story.seen).toEqual(['intro']);
  });

  it('applyEffects short-circuits on failure', () => {
    const r = applyEffects(
      base,
      [
        { kind: 'gainResource', resourceId: 'wood', amount: 2 },
        { kind: 'spendResource', resourceId: 'wood', amount: 5 },
        { kind: 'gainResource', resourceId: 'wood', amount: 99 },
      ],
      defs,
    );
    expect(r.ok).toBe(false);
  });

  it('clamps to resource max', () => {
    const cappedDefs: GameDefinition = {
      ...defs,
      resources: [{ id: 'wood', name: localizedKey('r.wood'), initial: 0, max: 5 }],
    };
    const cappedBase = createInitialState(cappedDefs);
    const r = applyEffect(cappedBase, { kind: 'gainResource', resourceId: 'wood', amount: 100 }, cappedDefs);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.state.resources.wood?.eq(toDecimal(5))).toBe(true);
  });
});
