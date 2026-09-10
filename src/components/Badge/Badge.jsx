import React from 'react';
import styles from './Badge.module.css';

/**
 * Badge — rótulo de status, categoria ou tipo
 * @param {string} variant — 'default'|'primary'|'success'|'warning'|'danger'|'accent'|'outline'
 * @param {string} size    — 'sm'|'md'
 * @param {node}   dot     — ponto de status antes do texto
 */
export default function Badge({ children, variant = 'default', size = 'md', dot = false, className = '' }) {
  return (
    <span className={[styles.badge, styles[variant], styles[size], className].filter(Boolean).join(' ')}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
