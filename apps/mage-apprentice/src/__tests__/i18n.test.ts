import { describe, expect, it } from 'vitest';
import { collectI18nKeys, validateGameDefinition } from '@clicker-game/engine';
import mageApprentice from '../game/index.js';

describe('mage-apprentice i18n', () => {
  it('passes engine validation (incl. translation key coverage in fr)', () => {
    expect(validateGameDefinition(mageApprentice)).toEqual([]);
  });

  it('every referenced game key exists in fr', () => {
    const keys = collectI18nKeys(mageApprentice);
    const fr = mageApprentice.messages.fr ?? {};
    for (const key of keys) {
      expect(fr[key], `missing fr translation for ${key}`).toBeTruthy();
    }
  });

  it('en has no orphan keys (every en key exists in fr)', () => {
    const fr = mageApprentice.messages.fr ?? {};
    const en = mageApprentice.messages.en ?? {};
    for (const key of Object.keys(en)) {
      expect(fr[key], `orphan en key ${key} not present in fr`).toBeDefined();
    }
  });
});
