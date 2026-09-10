import React from 'react';
import { TestimonialCard } from '../../../components/index';
import styles from './SectionShared.module.css';

export default function TestimonialsSection({ testimonials }) {
  const approved = testimonials.filter(t => t.approved);

  if (!approved.length) return null;

  return (
    <section className={styles.section} id="depoimentos">
      <div className="container">
        <div className={`${styles.sectionHeader} ${styles.sectionCenter}`}>
          <div>
            <p className={styles.sectionEyebrow}>Depoimentos</p>
            <h2 className={styles.sectionTitle}>O que nossos clientes dizem</h2>
            <p className={styles.sectionSubtitle}>
              Depoimentos reais de quem já utilizou nossas soluções.
            </p>
          </div>
        </div>

        <div className={styles.grid3}>
          {approved.map(t => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
