import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, MessageSquare } from 'lucide-react';
import { Button } from '../../../components/index';
import styles from './HeroSection.module.css';

export default function HeroSection({ settings }) {
  const heading = settings?.heroHeading || 'Tecnologia & Criatividade que trabalham por você';
  const highlight = settings?.heroHighlight || 'trabalham por você';
  const subheading = settings?.heroSubheading || 'Sistemas, livros (incluindo romances), produtos digitais, projetos criativos e soluções sob medida — desenvolvidos para inspirar, automatizar e transformar todos os aspectos da vida e dos negócios com inovação, tecnologia de ponta e design extraordinário.';
  const ctaPrimaryText = settings?.heroCtaPrimaryText || 'Ver Produtos';
  const ctaPrimaryLink = settings?.heroCtaPrimaryLink || '/produtos';
  const ctaSecondaryText = settings?.heroCtaSecondaryText || 'Solicitar Orçamento';
  const ctaSecondaryLink = settings?.heroCtaSecondaryLink || '#servicos';
  const trustBadges = settings?.heroTrustBadges || [
    '✓ Entrega imediata em produtos digitais',
    '✓ Suporte especializado',
    '✓ Tecnologia & Design moderno'
  ];

  const renderHeading = () => {
    if (highlight && heading.includes(highlight)) {
      const parts = heading.split(highlight);
      return (
        <>
          {parts[0]}
          <span className={styles.highlight}>{highlight}</span>
          {parts[1]}
        </>
      );
    }
    return heading;
  };

  const handleSecondaryClick = () => {
    if (ctaSecondaryLink.startsWith('#')) {
      const element = document.getElementById(ctaSecondaryLink.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = ctaSecondaryLink;
    }
  };

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Animated background grid */}
      <div className={styles.grid} aria-hidden="true" />

      {/* Glow orbs */}
      <div className={`${styles.orb} ${styles.orb1}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orb2}`} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <div className={styles.tag}>
          <span className={styles.tagDot} />
          Plataforma Oficial TF Hub
        </div>

        <h1 className={styles.heading}>
          {renderHeading()}
        </h1>

        <p className={styles.subheading}>
          {subheading}
        </p>

        <div className={styles.cta}>
          <Button
            as={Link}
            to={ctaPrimaryLink}
            variant="accent"
            size="lg"
            iconRight={<ShoppingBag size={18} />}
          >
            {ctaPrimaryText}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            iconRight={<MessageSquare size={18} />}
            onClick={handleSecondaryClick}
          >
            {ctaSecondaryText}
          </Button>
        </div>

        {/* Trust badges */}
        <div className={styles.trust}>
          {trustBadges.map((badge, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className={styles.trustSep} />}
              <span className={styles.trustItem}>{badge}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollDot} />
      </div>
    </section>
  );
}
