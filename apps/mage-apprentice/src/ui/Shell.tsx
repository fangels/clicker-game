import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../state/context.js';
import { persistLocale } from '../i18n/setup.js';
import styles from './Shell.module.css';

type ShellProps = {
  resources: ReactNode;
  actions: ReactNode;
  upgrades: ReactNode;
  quests: ReactNode;
  story: ReactNode;
};

export const Shell = ({ resources, actions, upgrades, quests, story }: ShellProps) => {
  const { t, i18n } = useTranslation();
  const store = useGameStore();

  const onChangeLocale = (locale: string) => {
    void i18n.changeLanguage(locale);
    persistLocale(locale);
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('ui:title')}</h1>
        <div className={styles.controls}>
          <label className={styles.lang}>
            <span>{t('ui:lang.label')}</span>
            <select value={i18n.resolvedLanguage} onChange={(e) => onChangeLocale(e.target.value)}>
              <option value="fr">{t('ui:lang.fr')}</option>
              <option value="en">{t('ui:lang.en')}</option>
            </select>
          </label>
          <button
            type="button"
            className={styles.reset}
            onClick={() => store.getState().reset()}
          >
            {t('ui:reset')}
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.col}>
          <h2>{t('ui:resources')}</h2>
          {resources}
          <h2>{t('ui:actions')}</h2>
          {actions}
          <h2>{t('ui:upgrades')}</h2>
          {upgrades}
        </section>
        <aside className={styles.col}>
          <h2>{t('ui:quests')}</h2>
          {quests}
          <h2>{t('ui:story')}</h2>
          {story}
        </aside>
      </main>
    </div>
  );
};
