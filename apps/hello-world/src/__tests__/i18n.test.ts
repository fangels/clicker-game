import { describe, expect, it } from 'vitest';
import { collectI18nKeys, validateGameDefinition } from '@clicker-game/engine';
import helloWorld from '../game/index.js';

describe('hello-world i18n', () => {
  it('passes engine validation (incl. translation key coverage in fr)', () => {
    expect(validateGameDefinition(helloWorld)).toEqual([]);
  });

  it('every referenced game key exists in fr', () => {
    const keys = collectI18nKeys(helloWorld);
    const fr = helloWorld.messages.fr ?? {};
    for (const key of keys) {
      expect(fr[key], `missing fr translation for ${key}`).toBeTruthy();
    }
  });

  it('en has no orphan keys (every en key exists in fr)', () => {
    const fr = helloWorld.messages.fr ?? {};
    const en = helloWorld.messages.en ?? {};
    for (const key of Object.keys(en)) {
      expect(fr[key], `orphan en key ${key} not present in fr`).toBeDefined();
    }
  });
});
