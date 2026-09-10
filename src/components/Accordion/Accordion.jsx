import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Accordion.module.css';

/**
 * Accordion — conteúdo expansível
 * @param {Array}   items     — [{ id, title, content }]
 * @param {boolean} multiple  — permite múltiplos abertos simultaneamente
 */
export default function Accordion({ items = [], multiple = false }) {
  const [open, setOpen] = useState([]);

  const toggle = (id) => {
    if (multiple) {
      setOpen(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setOpen(prev => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className={`${styles.item} ${isOpen ? styles.isOpen : ''}`}>
            <button
              className={styles.trigger}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span className={styles.triggerLabel}>{item.title}</span>
              <ChevronDown className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} size={18} />
            </button>
            <div className={styles.contentWrapper} style={{ maxHeight: isOpen ? '600px' : '0' }}>
              <div className={styles.content}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
