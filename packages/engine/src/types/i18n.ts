declare const localizedKeyBrand: unique symbol;

export type LocalizedKey = string & { readonly [localizedKeyBrand]: 'LocalizedKey' };

export const localizedKey = (key: string): LocalizedKey => key as LocalizedKey;

export type MessageDictionary = Record<string, string>;

export type LocaleMessages = Record<string, MessageDictionary>;
