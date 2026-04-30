import type { Decimal } from '@clicker-game/engine';

const SUFFIX_FR = ['', 'K', 'M', 'Md', 'B', 'BB', 'T'];
const SUFFIX_EN = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];

const pickSuffix = (locale: string): string[] => (locale.startsWith('fr') ? SUFFIX_FR : SUFFIX_EN);

export const formatBigNumber = (value: Decimal, locale = 'fr'): string => {
  const exp = value.exponent;
  if (exp < 3) {
    const n = value.toNumber();
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n);
  }
  const tier = Math.floor(exp / 3);
  const suffixes = pickSuffix(locale);
  if (tier < suffixes.length) {
    const scale = Math.pow(10, tier * 3);
    const scaled = value.toNumber() / scale;
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(scaled)} ${suffixes[tier]}`;
  }
  return value.toExponential(2);
};
