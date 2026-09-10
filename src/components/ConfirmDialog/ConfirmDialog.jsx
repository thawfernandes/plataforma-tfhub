import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

/**
 * ConfirmDialog — substitui window.confirm()
 * @param {boolean}  open        — controlado externamente
 * @param {function} onConfirm   — callback ao confirmar
 * @param {function} onClose     — callback ao cancelar
 * @param {string}   title       — título do diálogo
 * @param {string}   description — texto explicativo
 * @param {string}   confirmText — texto do botão de confirmação
 * @param {string}   variant     — 'danger'|'warning'
 */
export function ConfirmDialog({
  open,
  onConfirm,
  onClose,
  title = 'Confirmar ação',
  description = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', padding: '0.5rem 0 1rem' }}>
        <div style={{
          width: 56, height: 56,
          borderRadius: '50%',
          background: variant === 'danger' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: variant === 'danger' ? 'var(--danger)' : 'var(--warning)',
        }}>
          {variant === 'danger' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{description}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant={variant} fullWidth onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
