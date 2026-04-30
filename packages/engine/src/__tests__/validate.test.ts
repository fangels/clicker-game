import { describe, expect, it } from 'vitest';
import { validateGameDefinition } from '../validate.js';
import type { GameDefinition } from '../types/gameDefinition.js';
import { localizedKey } from '../types/i18n.js';

const baseDef = (): GameDefinition => ({
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
  actions: [{ id: 'chop', label: localizedKey('a.chop'), yield: [{ resourceId: 'wood', amount: 1 }] }],
  upgrades: [],
  quests: [],
  story: [],
  messages: { fr: { 'r.wood': 'Bois', 'a.chop': 'Couper' } },
});

describe('validateGameDefinition', () => {
  it('accepts a valid definition', () => {
    expect(validateGameDefinition(baseDef())).toEqual([]);
  });

  it('flags duplicate ids', () => {
    const def = baseDef();
    def.resources.push({ id: 'wood', name: localizedKey('r.wood'), initial: 0 });
    const errors = validateGameDefinition(def);
    expect(errors.some((e) => e.message.includes('duplicate'))).toBe(true);
  });

  it('flags unknown resource references', () => {
    const def = baseDef();
    def.actions[0]!.cost = [{ resourceId: 'gold', amount: 1 }];
    const errors = validateGameDefinition(def);
    expect(errors.some((e) => e.message.includes('gold'))).toBe(true);
  });

  it('flags missing translation keys', () => {
    const def = baseDef();
    def.messages.fr = {};
    const errors = validateGameDefinition(def);
    expect(errors.some((e) => e.message.includes('missing translation'))).toBe(true);
  });
});
