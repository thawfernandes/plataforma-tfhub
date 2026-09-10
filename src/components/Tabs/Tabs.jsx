import React, { useState } from 'react';
import styles from './Tabs.module.css';

/**
 * Tabs — navegação por abas
 * @param {Array}  tabs       — [{ id, label, icon?, count? }]
 * @param {string} active     — id da aba ativa (controlado externamente)
 * @param {function} onChange — callback com o id clicado
 * @param {string} variant    — 'line'|'pill'|'card'
 */
export default function Tabs({ tabs = [], active, onChange, variant = 'line', className = '' }) {
  const [internal, setInternal] = useState(tabs[0]?.id);
  const current = active !== undefined ? active : internal;
  const handleChange = (id) => {
    setInternal(id);
    onChange?.(id);
  };

  return (
    <div className={`${styles.tabs} ${styles[variant]} ${className}`} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={current === tab.id}
          className={`${styles.tab} ${current === tab.id ? styles.active : ''}`}
          onClick={() => handleChange(tab.id)}
        >
          {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className={styles.count}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
