import { useStore } from 'zustand';
import { useTranslation } from 'react-i18next';
import { selectActiveQuests, selectCompletedQuests } from '@clicker-game/engine';
import { useGameStore } from '../state/context.js';
import styles from './QuestLog.module.css';

export const QuestLog = () => {
  const { t } = useTranslation();
  const store = useGameStore();
  const state = useStore(store, (s) => s.state);
  const defs = useStore(store, (s) => s.defs);
  const active = selectActiveQuests(state, defs);
  const completed = selectCompletedQuests(state, defs);
  const inactiveButCloseable = defs.quests.filter(
    (q) => !q.startWhen && (state.quests[q.id] ?? 'inactive') === 'inactive',
  );
  const visibleActive = [...active, ...inactiveButCloseable];

  return (
    <div className={styles.root}>
      {visibleActive.length === 0 ? (
        <p className={styles.empty}>{t('ui:quests.empty')}</p>
      ) : (
        <ul className={styles.list}>
          {visibleActive.map((q) => (
            <li key={q.id} className={styles.item}>
              <span className={styles.name}>{t(q.name)}</span>
              {q.description ? <span className={styles.desc}>{t(q.description)}</span> : null}
            </li>
          ))}
        </ul>
      )}
      {completed.length > 0 ? (
        <>
          <h3 className={styles.completedTitle}>{t('ui:quests.completed')}</h3>
          <ul className={styles.list}>
            {completed.map((q) => (
              <li key={q.id} className={`${styles.item} ${styles.done}`}>
                <span className={styles.name}>{t(q.name)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};
