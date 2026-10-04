import { en, type Strings } from './en';
import { ro } from './ro';
import { ru } from './ru';
import { uk } from './uk';

const dictionaries: Record<string, Strings> = { en, ru, uk, ro };

function detectLanguage(): string {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const language = locale.split(/[-_]/)[0].toLowerCase();
  return language in dictionaries ? language : 'en';
}

// UI language follows the system language; falls back to English.
export const strings: Strings = dictionaries[detectLanguage()];
