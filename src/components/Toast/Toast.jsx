import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

// ─── Toast Provider & Hook ──────────────────────────────────────────────────

let globalAddToast = null;

export function useToast() {
  const add = useCallback((message, options = {}) => {
    if (globalAddToast) globalAddToast(message, options);
  }, []);

  return {
    toast: {
      success: (msg, opts) => add(msg, { ...opts, type: 'success' }),
      error:   (msg, opts) => add(msg, { ...opts, type: 'error' }),
      warning: (msg, opts) => add(msg, { ...opts, type: 'warning' }),
      info:    (msg, opts) => add(msg, { ...opts, type: 'info' }),
    },
  };
}

// ─── Individual Toast Item ──────────────────────────────────────────────────

const ICONS = {
  success: <CheckCircle size={18} />,
  error:   <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
};

function ToastItem({ id, message, type = 'info', duration = 4000, onRemove }) {
  const [exiting, setExiting] = useState(false);

  const handleRemove = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  useEffect(() => {
    const timer = setTimeout(handleRemove, duration);
    return () => clearTimeout(timer);
  }, [handleRemove, duration]);

  return (
    <div className={`${styles.toast} ${styles[type]} ${exiting ? styles.exit : styles.enter}`}>
      <span className={styles.icon}>{ICONS[type]}</span>
      <p className={styles.message}>{message}</p>
      <button className={styles.close} onClick={handleRemove} aria-label="Fechar">
        <X size={16} />
      </button>
    </div>
  );
}

// ─── Toast Container (mount once at root) ──────────────────────────────────

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message, options = {}) => {
    const id = `toast-${++counterRef.current}`;
    setToasts(prev => [...prev, { id, message, ...options }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Register global handler
  useEffect(() => {
    globalAddToast = addToast;
    return () => { globalAddToast = null; };
  }, [addToast]);

  if (!toasts.length) return null;

  return createPortal(
    <div className={styles.container} role="region" aria-label="Notificações">
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
}
