import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { ContentCard, Modal } from '../../../components/index';
import styles from './SectionShared.module.css';

export default function ContentSection({ content }) {
  const [playing, setPlaying] = useState(null);
  const latest = content.slice(0, 3);

  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} id="conteudo">
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Centro de Conteúdo</p>
            <h2 className={styles.sectionTitle}>Artigos, vídeos e muito mais</h2>
            <p className={styles.sectionSubtitle}>
              Conteúdo técnico e educativo produzido pela equipe TF Hub.
            </p>
          </div>
          <Link to="/conteudo" className={styles.seeAll}>
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {latest.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem',
            color: 'var(--text-muted)', background: 'var(--bg-tertiary)',
            borderRadius: 14, border: '1px dashed var(--border-color)'
          }}>
            <p>Nenhum conteúdo publicado ainda.</p>
          </div>
        ) : (
          <div className={styles.grid3}>
            {latest.map(item => (
              <ContentCard
                key={item.id}
                item={item}
                onPlayVideo={setPlaying}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <Modal
        open={!!playing}
        onClose={() => setPlaying(null)}
        title={playing?.title}
        size="lg"
      >
        {playing?.metadata?.videoUrl && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden' }}>
            <iframe
              src={playing.metadata.videoUrl}
              title={playing.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </section>
  );
}
