import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../state/context.js';
import styles from './StoryFeed.module.css';

export const StoryFeed = () => {
  const { t } = useTranslation();
  const store = useGameStore();
  const feed = useStore(store, (s) => s.state.story.feed);
  const defs = useStore(store, (s) => s.defs);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
  }, [feed.length]);

  if (feed.length === 0) {
    return <p className={styles.empty}>{t('ui:story.empty')}</p>;
  }

  return (
    <div ref={ref} className={styles.feed}>
      {feed.map((entry, idx) => {
        const node = defs.story.find((s) => s.id === entry.nodeId);
        if (!node) return null;
        return (
          <p key={`${entry.nodeId}-${idx}`} className={styles.entry}>
            {t(node.body)}
          </p>
        );
      })}
    </div>
  );
};
