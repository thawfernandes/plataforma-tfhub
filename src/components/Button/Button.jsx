import React, { forwardRef } from 'react';
import styles from './Button.module.css';

/**
 * Button — componente base reutilizável
 *
 * @param {string}  variant   — 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
 * @param {string}  size      — 'sm' | 'md' | 'lg'
 * @param {boolean} loading   — exibe spinner e desabilita
 * @param {boolean} fullWidth — ocupa 100% da largura
 * @param {node}    iconLeft  — ícone antes do texto
 * @param {node}    iconRight — ícone após o texto
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {!loading && iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      {children && <span className={styles.label}>{children}</span>}
      {!loading && iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  );
});

export default Button;
