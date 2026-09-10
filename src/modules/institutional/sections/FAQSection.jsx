import React from 'react';
import { Accordion } from '../../../components/index';
import styles from './SectionShared.module.css';

export default function FAQSection({ faq }) {
  if (!faq?.length) return null;

  const items = faq.map(f => ({
    id: f.id,
    title: f.question,
    content: f.answer,
  }));

  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} id="faq">
      <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className={`${styles.sectionHeader} ${styles.sectionCenter}`}>
          <div>
            <p className={styles.sectionEyebrow}>Perguntas Frequentes</p>
            <h2 className={styles.sectionTitle}>Respostas para suas dúvidas</h2>
            <p className={styles.sectionSubtitle}>
              Tudo o que você precisa saber antes de comprar ou contratar.
            </p>
          </div>
        </div>

        <Accordion items={items} />
      </div>
    </section>
  );
}
