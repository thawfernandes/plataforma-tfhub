import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, X, Share2, ArrowUpRight, TabletSmartphone, Apple } from 'lucide-react';
import phoenixImg from '../../assets/phoenix.png';
import styles from './PwaInstallPrompt.module.css';

export default function PwaInstallPrompt({ compact = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('android');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Detect if app is already running in standalone (installed) mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true || 
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    // 2. Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIosDevice);
    setIsAndroid(isAndroidDevice);
    if (isIosDevice) setActiveTab('ios');

    // 3. Listen for Android/Chrome native beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + '/admin';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/admin')}&bgcolor=14-16-20&color=212-175-55`;

  if (compact) {
    return (
      <>
        <button 
          onClick={() => setShowModal(true)} 
          className={styles.btnInstallSecondary}
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          title="Instalar App no Celular"
        >
          <Smartphone size={14} style={{ color: 'var(--accent)' }} />
          <span>{isInstalled ? 'App Instalado ✓' : 'Instalar no Celular'}</span>
        </button>

        {showModal && renderModal()}
      </>
    );
  }

  function renderModal() {
    return (
      <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img src={phoenixImg} alt="TF Hub" style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'contain' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Como Instalar no Celular</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>TF Hub Admin — Aplicativo Standalone</p>
            </div>
          </div>

          <div className={styles.tabButtons}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'android' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('android')}
            >
              <Smartphone size={18} />
              <span>Android (Chrome)</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'ios' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('ios')}
            >
              <Apple size={18} />
              <span>iPhone (iOS Safari)</span>
            </button>
          </div>

          {activeTab === 'android' ? (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No Android, o sistema é instalado como um aplicativo nativo em tela cheia:
              </p>
              <div className={styles.stepsList}>
                <div className={styles.stepItem}>
                  <span className={styles.stepNumber}>1</span>
                  <p className={styles.stepText}>Abra o link do painel no navegador <strong>Google Chrome</strong> do seu Android.</p>
                </div>
                <div className={styles.stepItem}>
                  <span className={styles.stepNumber}>2</span>
                  <p className={styles.stepText}>Toque no menu de <strong>3 pontos (⋮)</strong> no canto superior direito do Chrome.</p>
                </div>
                <div className={styles.stepItem}>
                  <span className={styles.stepNumber}>3</span>
                  <p className={styles.stepText}>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
                </div>
                <div className={styles.stepItem}>
                  <span className={styles.stepNumber}>4</span>
                  <p className={styles.stepText}>Confirme em <strong>"Instalar"</strong>. O ícone da TF Hub aparecerá junto aos seus outros apps!</p>
                </div>
              </div>

              {deferredPrompt && (
                <button 
                  onClick={handleNativeInstall} 
                  className={styles.btnInstallPrimary}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                >
                  <Download size={18} />
                  <span>Instalar Diretamente Agora</span>
                </button>
              )}
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No iPhone / iPad, a instalação é feita rapidamente pelo Safari:
              </p>
              <div className={styles.stepsList}>
                <div className={styles.stepItem}>
                  <span className={styles.stepNumber}>1</span>
                  <p className={styles.stepText}>Abra este painel no <strong>Safari</strong> do seu iPhone.</p>
                </div>
                <div className={styles.stepItem}>
                  <span className={styles.stepNumber}>2</span>
                  <p className={styles.stepText}>Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima <strong>⬆️</strong> na barra inferior).</p>
                </div>
                <div className={styles.stepItem}>
                  <span className={styles.stepNumber}>3</span>
                  <p className={styles.stepText}>Role a lista para baixo e toque em <strong>"Adicionar à Tela de Início" (➕)</strong>.</p>
                </div>
                <div className={styles.stepItem}>
                  <span className={styles.stepNumber}>4</span>
                  <p className={styles.stepText}>Toque em <strong>"Adicionar"</strong> no topo direito. Pronto! O app abrirá em tela cheia sem barra de navegador.</p>
                </div>
              </div>
            </div>
          )}

          {/* QR Code section to open on phone */}
          <div className={styles.qrContainer}>
            <div style={{ flex: 1, paddingRight: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--accent)' }}>Abrir no Celular</h4>
              <p style={{ margin: '4px 0 10px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Aponte a câmera do seu celular para o QR Code ao lado para abrir o link e instalar.
              </p>
              <button 
                onClick={handleCopyLink} 
                className={styles.btnInstallSecondary}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Share2 size={14} />
                <span>{copied ? '✓ Link Copiado!' : 'Copiar Link do Painel'}</span>
              </button>
            </div>
            <img 
              src={qrUrl} 
              alt="QR Code para Celular" 
              style={{ width: '90px', height: '90px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#141620' }} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.installCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardLeft}>
          <img src={phoenixImg} alt="TF Hub App" className={styles.appIcon} />
          <div>
            <h3 className={styles.title}>
              <span>Painel no Celular (Android & iOS)</span>
              <span className={styles.badge}>PWA App</span>
            </h3>
            <p className={styles.desc}>
              Instale o aplicativo da Plataforma TF Hub no seu smartphone para controlar o site, atualizar o portfólio, aprovar orçamentos e gerenciar pedidos em tela cheia com acesso instantâneo.
            </p>
          </div>
        </div>

        {isInstalled && (
          <div className={styles.installedStatus}>
            <CheckCircle2 size={16} />
            <span>App Instalado / Modo Standalone</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {deferredPrompt ? (
          <button onClick={handleNativeInstall} className={styles.btnInstallPrimary}>
            <Download size={18} />
            <span>Instalar App no Android / Chrome</span>
          </button>
        ) : (
          <button onClick={() => { setActiveTab('android'); setShowModal(true); }} className={styles.btnInstallPrimary}>
            <Smartphone size={18} />
            <span>Instalar no Android</span>
          </button>
        )}

        <button onClick={() => { setActiveTab('ios'); setShowModal(true); }} className={styles.btnInstallSecondary}>
          <Apple size={18} />
          <span>Instalar no iPhone (iOS)</span>
        </button>

        <button onClick={() => setShowModal(true)} className={styles.btnInstallSecondary}>
          <TabletSmartphone size={18} />
          <span>QR Code & Instruções</span>
        </button>
      </div>

      {showModal && renderModal()}
    </section>
  );
}
