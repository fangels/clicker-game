export type RngState = {
  seed: number;
  counter: number;
};

export const createRngState = (seed: number): RngState => ({ seed: seed >>> 0, counter: 0 });

const mulberry32 = (a: number): number => {
  a = (a + 0x6d2b79f5) >>> 0;
  let t = a;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const next = (state: RngState): { value: number; state: RngState } => {
  const value = mulberry32((state.seed + state.counter) >>> 0);
  return { value, state: { seed: state.seed, counter: state.counter + 1 } };
};

export const nextInt = (
  state: RngState,
  minInclusive: number,
  maxExclusive: number,
): { value: number; state: RngState } => {
  const { value, state: nextState } = next(state);
  const span = maxExclusive - minInclusive;
  return { value: Math.floor(value * span) + minInclusive, state: nextState };
};
