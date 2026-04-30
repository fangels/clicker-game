import { describe, expect, it } from 'vitest';
import { serialize, deserialize } from '../persistence.js';
import { createInitialState } from '../initialState.js';
import { applyEffect } from '../effects.js';
import { migrate, CURRENT_SCHEMA_VERSION } from '../migrations.js';
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
  quests: [],
  story: [],
  messages: { fr: { 'r.wood': 'Bois' } },
};

describe('persistence', () => {
  it('round-trips serialize → deserialize preserving Decimal values', () => {
    let state = createInitialState(defs);
    const r = applyEffect(state, { kind: 'gainResource', resourceId: 'wood', amount: '1e30' }, defs);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    state = r.state;
    const blob = serialize(state);
    const restored = deserialize(blob);
    expect(restored.resources.wood?.toString()).toBe(state.resources.wood?.toString());
  });

  it('migrate fills schemaVersion to current', () => {
    const raw = serialize(createInitialState(defs)).state;
    const result = migrate({ ...raw, schemaVersion: 0 });
    expect(result.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });
});
