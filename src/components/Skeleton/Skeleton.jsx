import React from 'react';
import styles from './Skeleton.module.css';

/**
 * Skeleton — placeholder animado durante carregamento
 * @param {string} variant — 'text'|'rect'|'circle'|'card'
 * @param {string} width   — CSS width
 * @param {string} height  — CSS height
 * @param {number} count   — número de linhas (para 'text')
 */
export function Skeleton({ variant = 'rect', width, height, count = 1, className = '' }) {
  if (variant === 'text') {
    return (
      <div className={`${styles.group} ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${styles.skeleton} ${styles.text}`}
            style={{ width: i === count - 1 && count > 1 ? '60%' : (width || '100%') }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`${styles.card} ${className}`}>
        <div className={`${styles.skeleton} ${styles.cardImg}`} />
        <div className={styles.cardBody}>
          <div className={`${styles.skeleton} ${styles.text}`} style={{ width: '40%' }} />
          <div className={`${styles.skeleton} ${styles.text}`} />
          <div className={`${styles.skeleton} ${styles.text}`} style={{ width: '80%' }} />
          <div className={`${styles.skeleton} ${styles.text}`} style={{ width: '30%', marginTop: '1rem' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

/**
 * Spinner — loading inline
 * @param {string} size — 'sm'|'md'|'lg'
 * @param {string} color — CSS color override
 */
export function Spinner({ size = 'md', color, className = '' }) {
  const sizes = { sm: 16, md: 24, lg: 40 };
  const px = sizes[size] || 24;
  return (
    <span
      className={`${styles.spinner} ${className}`}
      style={{ width: px, height: px, borderTopColor: color || 'var(--accent)' }}
      role="status"
      aria-label="Carregando"
    />
  );
}
