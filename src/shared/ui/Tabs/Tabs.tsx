import { useState, type ReactNode } from 'react';
import styles from './Tabs.module.scss';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

/**
 * Componente de Tabs reutilizable
 */
export function Tabs({ tabs, defaultTabId }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(
    defaultTabId || tabs[0]?.id || ''
  );

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${
              activeTabId === tab.id ? styles.active : ''
            }`}
            onClick={() => setActiveTabId(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab?.content}
      </div>
    </div>
  );
}
