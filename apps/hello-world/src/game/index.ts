import type { GameDefinition } from '@clicker-game/engine';
import { localizedKey } from '@clicker-game/engine';
import { resources } from './resources.js';
import { actions } from './actions.js';
import { upgrades } from './upgrades.js';
import { quests } from './quests.js';
import { story } from './story.js';
import { theme } from './theme.js';
import { messages } from './i18n/index.js';

export const helloWorld: GameDefinition = {
  meta: {
    id: 'hello-world',
    version: '0.1.0',
    defaultLocale: 'fr',
    supportedLocales: ['fr', 'en'],
  },
  theme,
  resources,
  actions,
  upgrades,
  quests,
  story,
  messages,
  tickRateMs: 100,
  initialSeed: 1,
};

export { localizedKey };
export default helloWorld;
