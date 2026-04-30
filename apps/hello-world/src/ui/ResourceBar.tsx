import { useStore } from 'zustand';
import { useTranslation } from 'react-i18next';
import { selectVisibleResources } from '@clicker-game/engine';
import { formatBigNumber } from '@clicker-game/ui-kit';
import { useGameStore } from '../state/context.js';
import styles from './ResourceBar.module.css';

export const ResourceBar = () => {
  const { t, i18n } = useTranslation();
  const store = useGameStore();
  const state = useStore(store, (s) => s.state);
  const defs = useStore(store, (s) => s.defs);
  const visible = selectVisibleResources(state, defs);

  if (visible.length === 0) return null;

  return (
    <ul className={styles.list}>
      {visible.map((r) => {
        const value = state.resources[r.id];
        return (
          <li key={r.id} className={styles.item} title={r.description ? t(r.description) : undefined}>
            <span className={styles.label}>{t(r.name)}</span>
            <span className={styles.value}>
              {value ? formatBigNumber(value, i18n.resolvedLanguage) : '0'}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
