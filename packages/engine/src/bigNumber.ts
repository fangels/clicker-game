import Decimal from 'break_infinity.js';

export { Decimal };

export type Numeric = Decimal | number | string;

export const toDecimal = (value: Numeric): Decimal => {
  if (value instanceof Decimal) return value;
  return new Decimal(value);
};

export const ZERO: Decimal = new Decimal(0);
export const ONE: Decimal = new Decimal(1);

export const isZero = (value: Decimal): boolean => value.lte(0);

export const max = (a: Decimal, b: Decimal): Decimal => (a.gte(b) ? a : b);
export const min = (a: Decimal, b: Decimal): Decimal => (a.lte(b) ? a : b);

export const clamp = (value: Decimal, lo?: Decimal, hi?: Decimal): Decimal => {
  let result = value;
  if (lo !== undefined && result.lt(lo)) result = lo;
  if (hi !== undefined && result.gt(hi)) result = hi;
  return result;
};

export const decimalToString = (value: Decimal): string => value.toString();

export const decimalFromString = (raw: string): Decimal => new Decimal(raw);
