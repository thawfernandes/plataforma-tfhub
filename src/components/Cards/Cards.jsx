import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ExternalLink, MapPin } from 'lucide-react';
import Button from '../Button/Button';
import { thumbnailService } from '../../services/thumbnailService';
import styles from './Cards.module.css';

// ─── ServiceCard ─────────────────────────────────────────────────────────────

export function ServiceCard({ service, onRequestQuote }) {
  return (
    <article className={styles.serviceCard}>
      {service.images?.[0] && (
        <div className={styles.serviceImageWrapper}>
          <img src={service.images[0]} alt={service.name} className={styles.serviceImage} loading="lazy" />
          <div className={styles.serviceImageOverlay} />
        </div>
      )}
      <div className={styles.serviceBody}>
        <h3 className={styles.serviceTitle}>{service.name}</h3>
        <p className={styles.serviceDesc}>{service.description}</p>
        
        {service.included && service.included.length > 0 && (
          <div className={styles.serviceIncluded}>
            <h4 className={styles.sectionLabel}>O que está incluso:</h4>
            <ul className={styles.includedList}>
              {service.included.map((item, idx) => (
                <li key={idx} className={styles.includedItem}>
                  <Check size={14} className={styles.checkIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.tiers && service.tiers.length > 0 && (
          <div className={styles.serviceTiers}>
            <h4 className={styles.sectionLabel}>Opções de planos:</h4>
            <div className={styles.tiersGrid}>
              {service.tiers.map((tier, idx) => (
                <div key={idx} className={styles.tierBadge}>
                  <span className={styles.tierName}>{tier.name}</span>
                  <span className={styles.tierPrice}>{tier.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.note && (
          <p className={styles.serviceNote}>
            * {service.note}
          </p>
        )}
      </div>

      <div className={styles.serviceFooter}>
        <div className={styles.priceContainer}>
          <span className={styles.priceLabel}>Investimento:</span>
          <span className={styles.priceValue}>{service.priceText}</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          iconRight={<ArrowRight size={14} />}
          onClick={() => onRequestQuote?.(service)}
          className={styles.quoteBtn}
        >
          Solicitar Orçamento
        </Button>
      </div>
    </article>
  );
}

// ─── PortfolioCard ────────────────────────────────────────────────────────────

function ProjectImagePlaceholder({ name }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 3)
        .toUpperCase()
    : 'TF';

  return (
    <div className={styles.placeholderContainer}>
      <div className={styles.placeholderGlow} />
      <span className={styles.placeholderInitials}>{initials}</span>
      <span className={styles.placeholderText}>Print em breve</span>
    </div>
  );
}

export function PortfolioCard({ project, onLearnMore }) {
  const defaultImage = thumbnailService.getProjectImage(project);
  const [imgSrc, setImgSrc] = useState(defaultImage);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (project?.link && imgSrc !== thumbnailService.getFallbackScreenshot(project.link)) {
      setImgSrc(thumbnailService.getFallbackScreenshot(project.link));
    } else {
      setImgError(true);
    }
  };

  const hasImage = !!imgSrc && !imgError;

  return (
    <article className={styles.portfolioCard}>
      <div className={styles.portfolioImageWrapper}>
        {hasImage ? (
          <img
            src={imgSrc}
            alt={project.name}
            className={styles.portfolioImage}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <ProjectImagePlaceholder name={project.name} />
        )}
        <div className={styles.portfolioImageOverlay} />
      </div>
      
      <div className={styles.portfolioBody}>
        <div className={styles.portfolioMeta}>
          <span className={styles.portfolioCategory}>{project.category}</span>
          {project.year && <span className={styles.portfolioYear}>{project.year}</span>}
        </div>
        
        <h3 className={styles.portfolioTitle}>{project.name}</h3>
        
        {(project.address || project.location) && (
          <div style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '-4px', marginBottom: '8px', fontWeight: 500 }}>
            <MapPin size={13} style={{ flexShrink: 0 }} />
            <span>{project.address || project.location}</span>
          </div>
        )}

        <p className={styles.portfolioDesc}>{project.description}</p>
        
        <div className={styles.techList}>
          {project.technologies?.slice(0, 3).map((t, i) => (
            <span key={i} className={styles.techTag}>{t}</span>
          ))}
          {project.technologies?.length > 3 && (
            <span className={styles.techTagMore}>+{project.technologies.length - 3}</span>
          )}
        </div>
      </div>

      <div className={styles.portfolioFooter}>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1, gap: '4px' }}
          >
            <span>Visitar</span>
            <ExternalLink size={12} />
          </a>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        
        <Link
          to={`/portfolio/${project.slug || project.id}`}
          onClick={(e) => {
            if (onLearnMore) {
              e.preventDefault();
              onLearnMore(project);
            }
          }}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1, gap: '4px' }}
        >
          <span>Saiba Mais</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
}

// ─── ContentCard ─────────────────────────────────────────────────────────────
// Detecta automaticamente se é vídeo ou artigo, e se é vídeo do YouTube

export function ContentCard({ item, onPlayVideo }) {
  const isVideo = item.type === 'video';
  // Videos synced from YouTube have IDs that start with 'yt_'
  const isYouTube = isVideo && item.id?.startsWith('yt_');

  // Extract the YouTube video URL for direct linking
  const getYouTubeLink = () => {
    const embedUrl = item.metadata?.videoUrl || '';
    const match = embedUrl.match(/embed\/([^?]+)/);
    if (match) return `https://www.youtube.com/watch?v=${match[1]}`;
    return 'https://www.youtube.com/@TF-HUB';
  };

  const handleClick = () => {
    if (isYouTube) {
      // YouTube videos open directly on YouTube in a new tab
      window.open(getYouTubeLink(), '_blank', 'noopener,noreferrer');
    } else if (isVideo) {
      onPlayVideo?.(item);
    }
  };

  return (
    <article className={styles.contentCard}>
      <div
        className={styles.contentImageWrapper}
        onClick={isVideo ? handleClick : undefined}
        style={{ cursor: isVideo ? 'pointer' : 'default' }}
      >
        <img src={item.images?.[0]} alt={item.title} className={styles.contentImage} loading="lazy" />
        {isVideo && (
          <div className={styles.playOverlay}>
            <span className={styles.playBtn}>▶</span>
          </div>
        )}
        {/* Badge de tipo: vermelho YouTube ou padrão */}
        {isYouTube ? (
          <span className={styles.contentTypeBadge} style={{ background: '#ff0000', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </span>
        ) : (
          <span className={styles.contentTypeBadge}>{isVideo ? 'Vídeo' : item.type}</span>
        )}
      </div>

      <div className={styles.contentBody}>
        <h3 className={styles.contentTitle}>{item.title}</h3>
        <p className={styles.contentExcerpt}>
          {item.body?.length > 120 ? `${item.body.substring(0, 120)}…` : item.body}
        </p>

        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          {!isVideo && item.metadata?.readingTime && (
            <span className={styles.readingTime}>{item.metadata.readingTime} de leitura</span>
          )}
          {isVideo && item.metadata?.duration && (
            <span className={styles.readingTime}>{item.metadata.duration}</span>
          )}
          {isYouTube && (
            <a
              href={getYouTubeLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: '#ff0000', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
              onClick={e => e.stopPropagation()}
            >
              Ver no YouTube →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── TestimonialCard ──────────────────────────────────────────────────────────

export function TestimonialCard({ testimonial }) {
  return (
    <article className={styles.testimonialCard}>
      <div className={styles.stars}>
        {'★'.repeat(5)}
      </div>
      <blockquote className={styles.testimonialQuote}>
        "{testimonial.content}"
      </blockquote>
      <div className={styles.testimonialAuthor}>
        <div className={styles.testimonialAvatar}>
          {testimonial.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className={styles.testimonialName}>{testimonial.name}</p>
          {testimonial.role && <p className={styles.testimonialRole}>{testimonial.role}</p>}
        </div>
      </div>
    </article>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

export function StatCard({ icon, label, value, description, variant = 'default' }) {
  return (
    <div className={`${styles.statCard} ${styles[`stat_${variant}`]}`}>
      {icon && <div className={styles.statIcon}>{icon}</div>}
      <div className={styles.statContent}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
        {description && <span className={styles.statDesc}>{description}</span>}
      </div>
    </div>
  );
}
