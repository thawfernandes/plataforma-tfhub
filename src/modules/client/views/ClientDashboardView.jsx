import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { mockDb } from '../../../services/mockDb';
import { 
  Download, Award, FileText, Send, Check, 
  ArrowUpRight, MessageSquare, Info, Calendar, DollarSign
} from 'lucide-react';
import styles from './ClientDashboardView.module.css';

export default function ClientDashboardView() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Client Chat Reply State
  const [clientReply, setClientReply] = useState({});
  // Contract view toggles per order
  const [openContracts, setOpenContracts] = useState({});

  useEffect(() => {
    if (!user) return;
    loadDashboardData();

    // Listen for real-time local updates from simulator
    const handleOrderUpdate = () => {
      loadDashboardData();
    };
    window.addEventListener('tf_order_updated', handleOrderUpdate);
    return () => window.removeEventListener('tf_order_updated', handleOrderUpdate);
  }, [user]);

  const loadDashboardData = () => {
    const allOrders = mockDb.get('orders') || [];
    setOrders(allOrders.filter(o => o.userId === user.id || (user.email && o.clientEmail?.toLowerCase() === user.email?.toLowerCase())));

    const allQuotes = mockDb.get('quotes') || [];
    setQuotes(allQuotes.filter(q => q.userId === user.id || (user.email && q.clientEmail?.toLowerCase() === user.email?.toLowerCase())));

    const allCerts = mockDb.get('certificates') || [];
    setCertificates(allCerts.filter(c => c.studentName?.toLowerCase() === user.name?.toLowerCase() || (user.email && c.email?.toLowerCase() === user.email?.toLowerCase())));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Aguardando pagamento': return styles.statusAwaiting;
      case 'Em análise': return styles.statusAnalysis;
      case 'Pagamento aprovado': return styles.statusApproved;
      case 'Projeto iniciado': return styles.statusStarted;
      case 'Em desenvolvimento': return styles.statusDev;
      case 'Finalizado': return styles.statusFinished;
      default: return '';
    }
  };

  // Render supporting message banner based on status
  const getStatusNotice = (status) => {
    switch (status) {
      case 'Aguardando pagamento':
        return 'Por favor, realize o PIX da entrada (50%) e anexe o comprovante de pagamento no canal para iniciarmos o projeto.';
      case 'Em análise':
        return 'Recebemos o seu comprovante. Nossa equipe de finanças está analisando a transação e liberará seu acesso em breve!';
      case 'Pagamento aprovado':
        return 'Seu pagamento foi confirmado! Seus downloads foram liberados ou seu projeto está na fila de inicialização.';
      case 'Projeto iniciado':
        return 'Seu projeto foi oficialmente iniciado! Nossa equipe de design e desenvolvimento está alinhando os escopos.';
      case 'Em desenvolvimento':
        return 'Seu projeto está em fase de desenvolvimento ativo no momento. Sinta-se à vontade para enviar dúvidas no chat abaixo!';
      case 'Finalizado':
        return 'Seu projeto foi entregue e finalizado com sucesso! Agradecemos a confiança na equipe TF Hub.';
      default:
        return 'Aguardando atualizações do projeto.';
    }
  };

  // Toggle Contract view
  const toggleContractText = (orderId) => {
    setOpenContracts(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Send message on support chat/mural
  const handleSendMessage = (e, orderId) => {
    e.preventDefault();
    const replyText = clientReply[orderId];
    if (!replyText || !replyText.trim()) return;

    const allOrders = mockDb.get('orders') || [];
    const idx = allOrders.findIndex(o => o.id === orderId);

    if (idx !== -1) {
      const message = {
        sender: 'client',
        senderName: user.name,
        text: replyText.trim(),
        timestamp: new Date().toISOString()
      };
      
      allOrders[idx].messages = allOrders[idx].messages || [];
      allOrders[idx].messages.push(message);
      
      mockDb.save('orders', allOrders);
      loadDashboardData();
      
      // Reset input text
      setClientReply(prev => ({
        ...prev,
        [orderId]: ''
      }));
    }
  };

  const handleInputChange = (orderId, value) => {
    setClientReply(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  // Check if status is eligible for downloads
  const canDownload = (status) => {
    const allowed = ['Pagamento aprovado', 'Projeto iniciado', 'Em desenvolvimento', 'Finalizado'];
    return allowed.includes(status);
  };

  return (
    <div className={styles.clientContainer + " container"}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <img 
          src={user?.avatar} 
          alt={user?.name} 
          className={styles.avatar} 
        />
        <div>
          <h1 className={styles.welcomeTitle}>Olá, {user?.name}!</h1>
          <p className={styles.subtitle}>Bem-vindo à sua Área do Cliente TF Hub. Acompanhe seus projetos e compras.</p>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Main Side: Purchase Orders List */}
        <div>
          <h2 className={styles.sectionTitle}>Minhas Compras & Projetos</h2>
          
          {orders.length === 0 ? (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Nenhum pedido encontrado</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                Assim que você adquirir um sistema ou solicitar um serviço, o progresso, downloads e mensagens aparecerão aqui em tempo real.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/produtos" className="btn btn-primary btn-sm">Ver Sistemas e Produtos</Link>
                <Link to="/servicos" className="btn btn-secondary btn-sm">Solicitar Orçamento</Link>
              </div>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                
                {/* Header info */}
                <div className={styles.orderHeader}>
                  <div>
                    <h3 className={styles.orderTitle}>{order.items[0]?.name}</h3>
                    <span className={styles.orderMeta}>ID Solicitação: {order.id} • Solicitado em: {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={styles.orderTotal}>R$ {order.total.toFixed(2)}</div>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`} style={{ marginTop: '6px', display: 'inline-block' }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Notification Banner */}
                <div style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.12)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Info size={16} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {getStatusNotice(order.status)}
                  </p>
                </div>

                {/* Timeline display */}
                <div className={styles.timelineSection}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Linha do Tempo do Projeto</h4>
                  <div className={styles.timeline}>
                    {order.timeline && order.timeline.map((event, idx) => {
                      const isLast = idx === order.timeline.length - 1;
                      return (
                        <div key={idx} className={styles.timelineItem}>
                          <div className={`${styles.timelineDot} ${isLast ? styles.timelineDotActive : styles.timelineDotDone}`} />
                          <div className={styles.timelineHeader}>
                            <span className={styles.timelineTitle}>{event.title}</span>
                            <span className={styles.timelineDate}>{new Date(event.date).toLocaleDateString('pt-BR')} - {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className={styles.timelineDesc}>{event.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Contract box */}
                {order.contractAccepted && (
                  <div className={styles.auditBox}>
                    <div className={styles.auditHeader}>
                      <FileText size={16} style={{ color: 'var(--success)' }} />
                      <span>Auditoria do Aceite Contratual</span>
                    </div>
                    <div className={styles.auditMeta}>
                      <p>Contrato assinado digitalmente em: {new Date(order.contractAcceptedAt).toLocaleString('pt-BR')}</p>
                      <p>Endereço de IP registrado: {order.contractAcceptedIp}</p>
                      
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ marginTop: '0.75rem', padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => toggleContractText(order.id)}
                      >
                        {openContracts[order.id] ? 'Ocultar Contrato' : 'Ver Contrato Completo'}
                      </button>

                      {openContracts[order.id] && (
                        <div className={styles.contractText}>
                          {order.contractTextVersion}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mural chat support */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
                    <span>Mural de Mensagens do Projeto</span>
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Use este mural para alinhar arquivos, tirar dúvidas e se comunicar com a equipe da TF Hub.
                  </p>

                  <div className={styles.chatBox}>
                    <div className={styles.messageList}>
                      {order.messages && order.messages.length > 0 ? (
                        order.messages.map((msg, idx) => (
                          <div 
                            key={idx} 
                            className={`${styles.messageItem} ${msg.sender === 'client' ? styles.messageItemClient : styles.messageItemAdmin}`}
                          >
                            <strong>{msg.senderName}:</strong>
                            <p style={{ margin: '4px 0 0' }}>{msg.text}</p>
                            <span className={styles.messageMeta}>
                              {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', margin: 'auto' }}>
                          Nenhuma mensagem ainda. Escreva uma mensagem abaixo!
                        </p>
                      )}
                    </div>

                    <form className={styles.chatForm} onSubmit={(e) => handleSendMessage(e, order.id)}>
                      <input 
                        type="text" 
                        placeholder="Escreva sua mensagem ou envie um link..." 
                        className={styles.chatInput}
                        value={clientReply[order.id] || ''}
                        onChange={(e) => handleInputChange(order.id, e.target.value)}
                      />
                      <button type="submit" className={styles.chatSendBtn}>
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Dynamic downloads section */}
                <div className={styles.downloadSection}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Arquivos & Instaladores</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Instalador, documentações ou código-fonte.</span>
                  </div>
                  
                  {canDownload(order.status) ? (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(order.items[0]?.demoUrl || order.items[0]?.metadata?.demoUrl || order.items[0]?.name?.includes('Arrecada')) && (
                        <a 
                          href={order.items[0]?.demoUrl || order.items[0]?.metadata?.demoUrl || 'https://thawfernandes.github.io/TF-Arrecada-/login'} 
                          className="btn btn-secondary" 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ArrowUpRight size={16} style={{ color: 'var(--accent)' }} />
                          <span>Entrar no Sistema Web</span>
                        </a>
                      )}

                      {(order.items[0]?.downloadUrl || order.items[0]?.metadata?.downloadUrl) ? (
                        <a 
                          href={order.items[0]?.downloadUrl || order.items[0]?.metadata?.downloadUrl} 
                          className="btn btn-primary" 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download size={16} />
                          <span>Baixar Arquivo / Instalador</span>
                        </a>
                      ) : (
                        <span className={styles.notice} style={{ color: 'var(--success)', fontWeight: 600 }}>
                          ✓ Acesso liberado (verifique as instruções por e-mail)
                        </span>
                      )}
                    </div>
                  ) : (
                    <button className="btn btn-secondary" disabled style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'not-allowed' }}>
                      <Download size={16} />
                      <span>Download Bloqueado (Aguardando Pagamento)</span>
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Sidebar: Certificates and Quotes */}
        <div>
          {/* Certificates */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Meus Certificados</h3>
            {certificates.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nenhum certificado emitido até o momento.</p>
            ) : (
              <div className={styles.sidebarList}>
                {certificates.map(cert => (
                  <div key={cert.id} className={styles.sidebarItem}>
                    <Award size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <strong style={{ fontSize: '0.88rem' }}>{cert.institution}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Carga Horária: {cert.hours} horas</span>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>Cód: {cert.validation_code}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quotes */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Orçamentos de Serviços</h3>
            {quotes.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nenhum orçamento solicitado.</p>
            ) : (
              <div className={styles.sidebarList}>
                {quotes.map(quote => (
                  <div key={quote.id} className={styles.sidebarItem}>
                    <FileText size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                      <strong style={{ fontSize: '0.88rem' }}>{quote.serviceName}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Solicitado: {new Date(quote.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span className={`${styles.statusBadge} ${quote.status === 'approved' ? styles.statusApproved : styles.statusPending}`} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                        {quote.status === 'pending' ? 'Em Análise' : 'Aprovado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
