import React, { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Input — campo de texto base
 * @param {string} label      — rótulo visível
 * @param {string} error      — mensagem de erro (exibe estado de erro)
 * @param {string} helper     — texto auxiliar abaixo do campo
 * @param {node}   iconLeft   — ícone dentro do campo (esquerda)
 * @param {node}   iconRight  — ícone dentro do campo (direita)
 */
export const Input = forwardRef(function Input(
  { label, error, helper, iconLeft, iconRight, id, className = '', ...props },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={`${styles.field} ${error ? styles.hasError : ''} ${iconLeft ? styles.hasIconLeft : ''} ${iconRight ? styles.hasIconRight : ''}`}>
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        <input ref={ref} id={inputId} className={styles.input} {...props} />
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>
      {error  && <p className={styles.error}>{error}</p>}
      {helper && !error && <p className={styles.helper}>{helper}</p>}
    </div>
  );
});

/**
 * Textarea — campo de texto multilinha
 */
export const Textarea = forwardRef(function Textarea(
  { label, error, helper, id, rows = 4, className = '', ...props },
  ref
) {
  const inputId = id || `ta-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
        <textarea ref={ref} id={inputId} rows={rows} className={`${styles.input} ${styles.textarea}`} {...props} />
      </div>
      {error  && <p className={styles.error}>{error}</p>}
      {helper && !error && <p className={styles.helper}>{helper}</p>}
    </div>
  );
});

/**
 * Select — campo de seleção
 */
export const Select = forwardRef(function Select(
  { label, error, helper, id, children, className = '', ...props },
  ref
) {
  const inputId = id || `sel-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={`${styles.field} ${styles.selectWrapper} ${error ? styles.hasError : ''}`}>
        <select ref={ref} id={inputId} className={`${styles.input} ${styles.select}`} {...props}>
          {children}
        </select>
        <span className={styles.selectArrow}>▾</span>
      </div>
      {error  && <p className={styles.error}>{error}</p>}
      {helper && !error && <p className={styles.helper}>{helper}</p>}
    </div>
  );
});
