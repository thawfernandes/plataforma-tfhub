import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { mockDb } from '../../../services/mockDb';
import { Badge, Modal, Spinner } from '../../../components/index';
import styles from './RecognitionsView.module.css';

const CATEGORY_VARIANT = {
  'Certificação': 'primary',
  'Premiação':    'accent',
  'Parceria':     'success',
  'Reconhecimento': 'warning',
};

export default function RecognitionsView() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('Todos');

  useEffect(() => {
    const data = mockDb.get('recognitions') || [];
    setItems(data);
    setLoading(false);
  }, []);

  const categories = ['Todos', ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = filter === 'Todos' ? items : items.filter(i => i.category === filter);

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.headerIcon}>
              <Award size={28} />
            </div>
            <div>
              <p className={styles.eyebrow}>Nossa Trajetória</p>
              <h1 className={styles.title}>Certificações & Reconhecimentos</h1>
              <p className={styles.subtitle}>
                Conquistas, certificações e reconhecimentos que reforçam nosso compromisso
                com a excelência técnica e a inovação.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Category filter */}
        {categories.length > 1 && (
          <div className={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className={styles.loadingCenter}>
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <Award size={48} opacity={0.3} />
            <p>Nenhum reconhecimento cadastrado ainda.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(item => (
              <article
                key={item.id}
                className={styles.card}
                onClick={() => setSelected(item)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(item)}
                aria-label={`Ver detalhes: ${item.title}`}
              >
                <div className={styles.cardImageWrapper}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <div className={styles.cardImageOverlay} />
                  <div className={styles.cardBadge}>
                    <Badge
                      variant={CATEGORY_VARIANT[item.category] || 'default'}
                      size="sm"
                    >
                      {item.category || 'Conquista'}
                    </Badge>
                  </div>
                  <div className={styles.viewHint}>
                    <ExternalLink size={18} />
                    <span>Ver detalhes</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <p className={styles.cardInstitution}>{item.institution}</p>
                  {item.date && (
                    <div className={styles.cardDate}>
                      <Calendar size={13} />
                      {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                        month: 'long', year: 'numeric'
                      })}
                    </div>
                  )}
                  <p className={styles.cardDesc}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        size="md"
      >
        {selected && (
          <div className={styles.modalContent}>
            <img
              src={selected.image}
              alt={selected.title}
              className={styles.modalImage}
            />
            <div className={styles.modalMeta}>
              <Badge variant={CATEGORY_VARIANT[selected.category] || 'default'}>
                {selected.category}
              </Badge>
              <span className={styles.modalInstitution}>{selected.institution}</span>
              {selected.date && (
                <div className={styles.cardDate}>
                  <Calendar size={13} />
                  {new Date(selected.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </div>
              )}
            </div>
            <p className={styles.modalDesc}>{selected.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
