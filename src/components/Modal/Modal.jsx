import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

/**
 * Modal — overlay genérico com portal
 * @param {boolean} open         — controlado externamente
 * @param {function} onClose     — callback ao fechar
 * @param {string}  title        — título do modal
 * @param {string}  size         — 'sm'|'md'|'lg'|'xl'|'full'
 * @param {boolean} closable     — exibe botão X e fecha ao clicar no overlay
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  closable = true,
  footer,
}) {
  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape' && closable) onClose?.();
  }, [closable, onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, handleEsc]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={closable ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`${styles.panel} ${styles[size]}`}
        onClick={e => e.stopPropagation()}
      >
        {(title || closable) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {closable && (
              <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
