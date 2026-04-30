import { describe, expect, it } from 'vitest';
import { createRngState, next } from '../rng.js';

describe('rng', () => {
  it('is deterministic from seed', () => {
    const a1 = next(createRngState(42));
    const a2 = next(createRngState(42));
    expect(a1.value).toBe(a2.value);
  });

  it('advances counter and produces different values', () => {
    let s = createRngState(7);
    const seen = new Set<number>();
    for (let i = 0; i < 5; i++) {
      const r = next(s);
      seen.add(r.value);
      s = r.state;
    }
    expect(seen.size).toBe(5);
  });
});
