import type { LocaleMessages } from './types/i18n.js';

export const ENGINE_MESSAGE_KEYS = {
  insufficientResource: 'engine:error.insufficientResource',
  unknownResource: 'engine:error.unknownResource',
  unknownUpgrade: 'engine:error.unknownUpgrade',
  unknownQuest: 'engine:error.unknownQuest',
  unknownStoryNode: 'engine:error.unknownStoryNode',
  upgradeMaxedOut: 'engine:error.upgradeMaxedOut',
  cooldownActive: 'engine:error.cooldownActive',
  saveLoaded: 'engine:notice.saveLoaded',
  saveCleared: 'engine:notice.saveCleared',
} as const;

export const engineMessages: LocaleMessages = {
  fr: {
    'engine:error.insufficientResource': 'Ressource insuffisante',
    'engine:error.unknownResource': 'Ressource inconnue',
    'engine:error.unknownUpgrade': 'Amélioration inconnue',
    'engine:error.unknownQuest': 'Quête inconnue',
    'engine:error.unknownStoryNode': 'Nœud narratif inconnu',
    'engine:error.upgradeMaxedOut': 'Amélioration déjà au maximum',
    'engine:error.cooldownActive': 'Action en récupération',
    'engine:notice.saveLoaded': 'Partie restaurée',
    'engine:notice.saveCleared': 'Sauvegarde effacée',
  },
  en: {
    'engine:error.insufficientResource': 'Not enough resource',
    'engine:error.unknownResource': 'Unknown resource',
    'engine:error.unknownUpgrade': 'Unknown upgrade',
    'engine:error.unknownQuest': 'Unknown quest',
    'engine:error.unknownStoryNode': 'Unknown story node',
    'engine:error.upgradeMaxedOut': 'Upgrade already maxed out',
    'engine:error.cooldownActive': 'Action on cooldown',
    'engine:notice.saveLoaded': 'Save restored',
    'engine:notice.saveCleared': 'Save cleared',
  },
};
