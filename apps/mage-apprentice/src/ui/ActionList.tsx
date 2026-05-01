import { useStore } from 'zustand';
import { useTranslation } from 'react-i18next';
import { selectActionDisplay, selectVisibleActions } from '@clicker-game/engine';
import { formatBigNumber } from '@clicker-game/ui-kit';
import { useGameStore } from '../state/context.js';
import styles from './ActionList.module.css';

export const ActionList = () => {
  const { t, i18n } = useTranslation();
  const store = useGameStore();
  const state = useStore(store, (s) => s.state);
  const defs = useStore(store, (s) => s.defs);
  const click = useStore(store, (s) => s.click);
  const visible = selectVisibleActions(state, defs);

  if (visible.length === 0) {
    return <p className={styles.empty}>—</p>;
  }

  return (
    <ul className={styles.list}>
      {visible.map((a) => {
        const display = selectActionDisplay(state, defs, a.id);
        return (
          <li key={a.id} className={styles.item}>
            <button
              type="button"
              className={styles.button}
              onClick={() => click(a.id)}
              disabled={!display.enabled}
              data-action-id={a.id}
            >
              <span className={styles.label}>{t(a.label)}</span>
              {a.description ? <span className={styles.desc}>{t(a.description)}</span> : null}
              <span className={styles.meta}>
                {display.cost.length > 0 ? (
                  <span className={styles.cost}>
                    {t('ui:cost')}{' '}
                    {display.cost
                      .map(
                        (c) =>
                          `${formatBigNumber(c.amount, i18n.resolvedLanguage)} ${t(
                            defs.resources.find((r) => r.id === c.resourceId)?.name ?? c.resourceId,
                          )}`,
                      )
                      .join(', ')}
                  </span>
                ) : null}
                {display.yield.length > 0 ? (
                  <span className={styles.yield}>
                    +{' '}
                    {display.yield
                      .map(
                        (y) =>
                          `${formatBigNumber(y.amount, i18n.resolvedLanguage)} ${t(
                            defs.resources.find((r) => r.id === y.resourceId)?.name ?? y.resourceId,
                          )}`,
                      )
                      .join(', ')}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
