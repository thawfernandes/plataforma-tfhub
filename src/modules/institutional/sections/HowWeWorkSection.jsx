import React from 'react';
import styles from './SectionShared.module.css';

const STEPS = [
  {
    number: '01',
    title: 'Briefing',
    description: 'Você descreve o projeto, os objetivos e os prazos necessários.'
  },
  {
    number: '02',
    title: 'Proposta',
    description: 'Analisamos e enviamos uma proposta técnica detalhada em até 24h.'
  },
  {
    number: '03',
    title: 'Início com 50%',
    description: 'Com 50% de entrada confirmada, o desenvolvimento começa de imediato.'
  },
  {
    number: '04',
    title: 'Entrega',
    description: 'Você recebe o projeto finalizado e libera os 50% restantes.'
  }
];

export default function HowWeWorkSection() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} id="como-trabalhamos">
      <div className="container">
        <div className={`${styles.sectionHeader} ${styles.sectionCenter}`}>
          <div>
            <p className={styles.sectionEyebrow}>Processo de Trabalho</p>
            <h2 className={styles.sectionTitle}>Como desenvolvemos seu projeto</h2>
            <p className={styles.sectionSubtitle}>
              Um processo simples, transparente e focado em entregar resultados reais no prazo combinado.
            </p>
          </div>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map(step => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>

        {/* Guarantee note */}
        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem',
          padding: '1.25rem',
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 12,
          maxWidth: 560,
          margin: '2.5rem auto 0',
        }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--success)' }}>✓ Segurança para você:</strong>{' '}
            A entrada de 50% garante o compromisso mútuo e o cumprimento dos prazos acordados. Contratos formais disponíveis.
          </p>
        </div>
      </div>
    </section>
  );
}
