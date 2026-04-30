import { describe, expect, it } from 'vitest';
import { getEffectiveYield, getEffectiveTickRate } from '../modifiers.js';
import { ZERO, toDecimal } from '../bigNumber.js';
import type { GameState } from '../types/gameState.js';
import type { Modifier } from '../types/modifier.js';

const baseState = (modifiers: Modifier[]): GameState => ({
  schemaVersion: 1,
  gameId: 't',
  gameVersion: '0',
  resources: {},
  clicks: {},
  cooldowns: {},
  upgrades: {},
  quests: {},
  story: { seen: [], feed: [] },
  modifiers,
  flags: {},
  rng: { seed: 1, counter: 0 },
  lastTickAt: 0,
});

describe('modifiers', () => {
  it('applies add then mul (order matters)', () => {
    const state = baseState([
      { id: 'a', target: { kind: 'actionYield', actionId: 'x', resourceId: 'r' }, op: 'add', value: 2 },
      { id: 'b', target: { kind: 'actionYield', actionId: 'x', resourceId: 'r' }, op: 'mul', value: 3 },
    ]);
    const result = getEffectiveYield(toDecimal(1), state, 'x', 'r');
    expect(result.toNumber()).toBe((1 + 2) * 3);
  });

  it('returns base when no modifiers', () => {
    const state = baseState([]);
    expect(getEffectiveYield(toDecimal(7), state, 'x', 'r').toNumber()).toBe(7);
  });

  it('tickRate sums add then multiplies mul, base zero', () => {
    const state = baseState([
      { id: 'a', target: { kind: 'tickRate', resourceId: 'r' }, op: 'add', value: 0.5 },
      { id: 'b', target: { kind: 'tickRate', resourceId: 'r' }, op: 'add', value: 0.5 },
      { id: 'c', target: { kind: 'tickRate', resourceId: 'r' }, op: 'mul', value: 2 },
    ]);
    expect(getEffectiveTickRate(state, 'r').toNumber()).toBe(2);
    expect(getEffectiveTickRate(state, 'other').eq(ZERO)).toBe(true);
  });
});
