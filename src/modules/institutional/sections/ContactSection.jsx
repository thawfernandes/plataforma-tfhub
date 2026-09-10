import React from 'react';
import styles from './ContactSection.module.css';

// Instagram icon SVG
function InstagramIcon({ size = 28, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

// YouTube icon SVG
function YoutubeIcon({ size = 28, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  );
}

// WhatsApp icon SVG
function WhatsAppIcon({ size = 28, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      fill="currentColor" 
      {...props}
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.51 5.277 3.51 8.484-.012 6.654-5.349 11.993-11.96 11.993-2.006-.001-3.98-.502-5.735-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.48 4.966 1.481 5.43.001 9.85-4.417 9.857-9.84.004-2.63-1.019-5.101-2.881-6.965-1.862-1.863-4.339-2.887-6.973-2.888-5.438 0-9.86 4.417-9.867 9.84-.001 1.777.472 3.511 1.369 5.03L2.247 21.91l4.4-1.756zM17.15 14.5c-.279-.14-1.647-.812-1.902-.903-.255-.094-.442-.14-.627.14-.185.279-.714.903-.875 1.09-.161.185-.322.21-.6.07-1.14-.57-1.95-1.01-2.73-1.687-.6-.52-1.18-1.16-1.48-1.67-.185-.323-.02-.5-.16-.64-.13-.13-.28-.32-.42-.48-.14-.16-.19-.28-.28-.47-.09-.19-.05-.35-.02-.5.03-.14.28-.68.42-.903.14-.23.19-.38.28-.57.09-.19.05-.35-.02-.5-.07-.14-.627-1.514-.86-2.072-.226-.547-.46-.47-.627-.48-.163-.008-.352-.01-.541-.01-.19 0-.5.07-.762.35-.262.28-.999.975-.999 2.378s1.02 2.76 1.16 2.95c.14.19 2.007 3.064 4.86 4.29 2.38.996 2.87.8 3.82.7.96-.1 1.9-.78 2.17-1.49.27-.7.27-1.31.19-1.44-.09-.14-.28-.21-.57-.35z"/>
    </svg>
  );
}

// TikTok icon SVG
function TikTokIcon({ size = 26, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      fill="currentColor" 
      {...props}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.62-.67-.02 3.22-.01 6.44-.02 9.65-.08 2.45-1.13 4.89-3.07 6.4-2.14 1.73-5.13 2.44-7.82 1.94-2.78-.51-5.26-2.45-6.42-5.06-1.39-3.04-1.01-6.88 1.02-9.52 1.83-2.43 4.81-3.79 7.84-3.53v4.06c-1.76-.23-3.6.36-4.73 1.78-.96 1.17-1.18 2.83-.62 4.25.54 1.39 1.85 2.48 3.32 2.77 1.48.3 3.08-.14 4.02-1.31.62-.75.82-1.74.8-2.71-.01-4.23-.01-8.46-.01-12.69z"/>
    </svg>
  );
}

export default function ContactSection() {
  const channels = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@tfhub.design',
      url: 'https://www.instagram.com/tfhub.design/',
      icon: <InstagramIcon />,
      btnText: 'Seguir perfil',
      isNewTab: true,
      className: styles.instagramCard
    },
    {
      id: 'whatsapp_thawanny',
      name: 'Falar com Thawanny',
      handle: 'WhatsApp direto',
      url: 'https://wa.me/5562999035313',
      icon: <WhatsAppIcon />,
      btnText: 'Iniciar conversa',
      isNewTab: false,
      className: styles.whatsappCard
    },
    {
      id: 'whatsapp_fabiana',
      name: 'Falar com Fabiana',
      handle: 'WhatsApp direto',
      url: 'https://wa.me/5561999425106',
      icon: <WhatsAppIcon />,
      btnText: 'Iniciar conversa',
      isNewTab: false,
      className: styles.whatsappCard
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@TF-HUB',
      url: 'https://www.youtube.com/@TF-HUB',
      icon: <YoutubeIcon />,
      btnText: 'Inscrever-se',
      isNewTab: true,
      className: styles.youtubeCard
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: 'Em breve',
      url: null,
      icon: <TikTokIcon />,
      btnText: 'Em breve',
      isNewTab: false,
      className: styles.tiktokCard,
      disabled: true
    }
  ];

  return (
    <section className={styles.section} id="contato">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <p className={styles.eyebrow}>Contato & Conexão</p>
          <h2 className={styles.title}>Escolha onde nos encontrar.</h2>
          <p className={styles.subtitle}>
            Fale diretamente com nossa equipe ou acompanhe nosso trabalho nas redes sociais.
          </p>
        </div>

        <div className={styles.grid}>
          {channels.map((ch) => {
            if (ch.disabled) {
              return (
                <div key={ch.id} className={`${styles.card} ${ch.className} ${styles.disabled}`}>
                  <div className={styles.iconWrapper}>{ch.icon}</div>
                  <h3 className={styles.cardName}>{ch.name}</h3>
                  <p className={styles.cardHandle}>{ch.handle}</p>
                  <span className={`${styles.btn} ${styles.disabledBtn}`}>{ch.btnText}</span>
                </div>
              );
            }

            return (
              <a
                key={ch.id}
                href={ch.url}
                target={ch.isNewTab ? '_blank' : '_self'}
                rel={ch.isNewTab ? 'noopener noreferrer' : undefined}
                className={`${styles.card} ${ch.className}`}
              >
                <div className={styles.iconWrapper}>{ch.icon}</div>
                <h3 className={styles.cardName}>{ch.name}</h3>
                <p className={styles.cardHandle}>{ch.handle}</p>
                <span className={styles.btn}>{ch.btnText}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
