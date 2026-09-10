import React from 'react';
import thawannyImg from '../../../assets/thawanny.png';
import fabianaImg from '../../../assets/fabiana.png';
import { resolveAssetUrl } from '../../../utils/assetHelper';
import styles from './TeamSection.module.css';

function getMemberPhoto(member) {
  if (!member) return '';
  if (member.id === 'team_thawanny' || member.name?.toLowerCase().includes('thawanny')) {
    return thawannyImg;
  }
  if (member.id === 'team_fabiana' || member.name?.toLowerCase().includes('fabiana')) {
    return fabianaImg;
  }
  return resolveAssetUrl(member.imageUrl);
}

export default function TeamSection({ team }) {
  const featuredMembers = (team || []).filter(m => m.featured !== false);

  if (featuredMembers.length === 0) return null;

  return (
    <section className={styles.section} id="sobre-nos">
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>A Equipe</p>
            <h2 className={styles.sectionTitle}>Quem Somos?</h2>
            <p className={styles.sectionSubtitle}>
              Conheça as mentes criativas por trás da tecnologia, design e desenvolvimento da TF Hub.
            </p>
          </div>
        </div>

        <div className={styles.membersContainer}>
          {featuredMembers.map((member, idx) => {
            const isEven = idx % 2 === 0;
            const photoSrc = getMemberPhoto(member);
            return (
              <div 
                key={member.id} 
                className={`${styles.memberRow} ${isEven ? styles.rowNormal : styles.rowReverse}`}
              >
                {/* Visual Image Column */}
                <div className={styles.imageCol}>
                  <div className={styles.imageFrame}>
                    <img 
                      src={photoSrc} 
                      alt={member.name} 
                      className={styles.memberImage} 
                    />
                    <div className={styles.imageOverlay} />
                  </div>
                </div>

                {/* Content Details Column */}
                <div className={styles.contentCol}>
                  <span className={styles.roleTag}>{member.role}</span>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  
                  {member.quote && (
                    <blockquote className={styles.quoteBlock}>
                      "{member.quote}"
                    </blockquote>
                  )}
                  
                  <p className={styles.description}>
                    {member.description}
                  </p>

                  {member.specialties && member.specialties.length > 0 && (
                    <div className={styles.specialtiesWrapper}>
                      <h4 className={styles.specialtiesLabel}>Especialidades chave:</h4>
                      <div className={styles.specialtiesGrid}>
                        {member.specialties.map((spec, sIdx) => (
                          <span key={sIdx} className={styles.specialtyBadge}>
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
