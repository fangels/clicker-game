import { useStore } from 'zustand';
import { useTranslation } from 'react-i18next';
import {
  evaluateCondition,
  selectVisibleUpgrades,
  toDecimal,
  ZERO,
} from '@clicker-game/engine';
import { formatBigNumber } from '@clicker-game/ui-kit';
import { useGameStore } from '../state/context.js';
import styles from './UpgradePanel.module.css';

export const UpgradePanel = () => {
  const { t, i18n } = useTranslation();
  const store = useGameStore();
  const state = useStore(store, (s) => s.state);
  const defs = useStore(store, (s) => s.defs);
  const buy = useStore(store, (s) => s.buy);
  const upgrades = selectVisibleUpgrades(state, defs);

  if (upgrades.length === 0) {
    return <p className={styles.empty}>{t('ui:upgrades.empty')}</p>;
  }

  return (
    <ul className={styles.list}>
      {upgrades.map((u) => {
        const purchased = (state.upgrades[u.id] ?? 0) >= 1;
        const canBuy =
          !purchased &&
          (!u.purchasableWhen || evaluateCondition(u.purchasableWhen, state, defs)) &&
          u.cost.every((c) => (state.resources[c.resourceId] ?? ZERO).gte(toDecimal(c.amount)));

        return (
          <li key={u.id} className={styles.item}>
            <div className={styles.head}>
              <span className={styles.name}>{t(u.name)}</span>
              {purchased ? <span className={styles.owned}>{t('ui:purchased')}</span> : null}
            </div>
            {u.description ? <p className={styles.desc}>{t(u.description)}</p> : null}
            <div className={styles.meta}>
              <span className={styles.cost}>
                {t('ui:cost')}{' '}
                {u.cost
                  .map(
                    (c) =>
                      `${formatBigNumber(toDecimal(c.amount), i18n.resolvedLanguage)} ${t(
                        defs.resources.find((r) => r.id === c.resourceId)?.name ?? c.resourceId,
                      )}`,
                  )
                  .join(', ')}
              </span>
              <button
                type="button"
                className={styles.buy}
                disabled={!canBuy}
                onClick={() => buy(u.id)}
              >
                {t('ui:buy')}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
