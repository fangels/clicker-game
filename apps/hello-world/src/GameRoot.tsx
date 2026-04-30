import { useEffect, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { applyTheme } from '@clicker-game/ui-kit';
import { assertValidGameDefinition, type GameDefinition } from '@clicker-game/engine';
import { setupI18n } from './i18n/setup.js';
import { createGameStore } from './state/store.js';
import { GameStoreContext } from './state/context.js';
import { useTickLoop } from './state/hooks.js';
import { Shell } from './ui/Shell.js';
import { ResourceBar } from './ui/ResourceBar.js';
import { ActionList } from './ui/ActionList.js';
import { UpgradePanel } from './ui/UpgradePanel.js';
import { QuestLog } from './ui/QuestLog.js';
import { StoryFeed } from './ui/StoryFeed.js';

type Props = { definition: GameDefinition };

const Booted = () => {
  useTickLoop(100);
  return (
    <Shell
      resources={<ResourceBar />}
      actions={<ActionList />}
      upgrades={<UpgradePanel />}
      quests={<QuestLog />}
      story={<StoryFeed />}
    />
  );
};

export const GameRoot = ({ definition }: Props) => {
  const [i18nReady, setI18nReady] = useState<null | Awaited<ReturnType<typeof setupI18n>>>(null);
  const store = useMemo(() => {
    assertValidGameDefinition(definition);
    return createGameStore(definition);
  }, [definition]);

  useEffect(() => {
    applyTheme(definition.theme);
  }, [definition]);

  useEffect(() => {
    let cancelled = false;
    setupI18n(definition).then((i) => {
      if (!cancelled) setI18nReady(i);
    });
    return () => {
      cancelled = true;
    };
  }, [definition]);

  if (!i18nReady) return null;

  return (
    <I18nextProvider i18n={i18nReady}>
      <GameStoreContext.Provider value={store}>
        <Booted />
      </GameStoreContext.Provider>
    </I18nextProvider>
  );
};
