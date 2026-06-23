import { it } from './dictionaries/it'
import { en } from './dictionaries/en'

export type Dictionary = typeof it
export type Locale = 'it' | 'en'

export const dictionaries = {
  it,
  en,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.it
}
