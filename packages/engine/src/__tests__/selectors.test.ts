import { describe, expect, it } from 'vitest';
import { selectVisibleUpgrades } from '../selectors.js';
import { createInitialState } from '../initialState.js';
import type { GameDefinition } from '../types/gameDefinition.js';
import { localizedKey } from '../types/i18n.js';

const defWithUpgrade = (): GameDefinition => ({
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
  upgrades: [
    {
      id: 'betterAxe',
      name: localizedKey('u.betterAxe'),
      cost: [{ resourceId: 'wood', amount: 10 }],
      visibleWhen: { kind: 'resourceAtLeast', resourceId: 'wood', amount: 5 },
      effects: [],
    },
  ],
  quests: [],
  story: [],
  messages: { fr: { 'r.wood': 'Bois', 'a.chop': 'Couper', 'u.betterAxe': 'Hache' } },
});

describe('selectVisibleUpgrades', () => {
  const defs = defWithUpgrade();

  it('hides upgrade when visibleWhen is not met and not purchased', () => {
    const state = createInitialState(defs);
    expect(selectVisibleUpgrades(state, defs)).toHaveLength(0);
  });

  it('keeps purchased upgrade visible even when visibleWhen no longer holds', () => {
    const state = { ...createInitialState(defs), upgrades: { betterAxe: 1 } };
    expect(selectVisibleUpgrades(state, defs).map((u) => u.id)).toEqual(['betterAxe']);
  });
});
