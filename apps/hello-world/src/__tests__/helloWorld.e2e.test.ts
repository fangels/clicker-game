import { describe, expect, it } from 'vitest';
import {
  clickAction,
  createInitialState,
  purchaseUpgrade,
  tick,
} from '@clicker-game/engine';
import helloWorld from '../game/index.js';

describe('hello-world e2e (engine only)', () => {
  it('plays through the demo loop', () => {
    let state = createInitialState(helloWorld);

    state = tick(state, 100, helloWorld);
    expect(state.story.seen).toContain('intro');

    for (let i = 0; i < 10; i++) {
      const r = clickAction(state, 'chopWood', helloWorld);
      expect(r.ok).toBe(true);
      if (r.ok) state = r.state;
    }
    expect(state.resources.wood?.toNumber()).toBe(10);

    const buy = purchaseUpgrade(state, 'betterAxe', helloWorld);
    expect(buy.ok).toBe(true);
    if (buy.ok) state = buy.state;
    expect(state.upgrades.betterAxe).toBe(1);
    expect(state.resources.wood?.toNumber()).toBe(0);

    const c = clickAction(state, 'chopWood', helloWorld);
    expect(c.ok).toBe(true);
    if (c.ok) state = c.state;
    expect(state.resources.wood?.toNumber()).toBe(2);

    for (let i = 0; i < 2; i++) {
      const r = clickAction(state, 'chopWood', helloWorld);
      if (r.ok) state = r.state;
    }
    expect(state.resources.wood?.toNumber()).toBeGreaterThanOrEqual(3);

    const reflect = clickAction(state, 'reflect', helloWorld);
    expect(reflect.ok).toBe(true);
    if (reflect.ok) state = reflect.state;
    expect(state.resources.insight?.toNumber()).toBe(1);

    state = tick(state, 100, helloWorld);
    expect(state.quests.firstInsight).toBe('completed');
    expect(state.story.seen).toContain('reward');
    expect(state.flags.insightful).toBe(true);
  });
});
