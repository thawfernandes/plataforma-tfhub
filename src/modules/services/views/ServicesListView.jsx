import React, { useState, useEffect, useContext } from 'react';
import { mockDb } from '../../../services/mockDb';
import { AuthContext } from '../../../context/AuthContext';
import { MessageSquare, CheckCircle, Check, ArrowRight } from 'lucide-react';

export default function ServicesListView() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [notes, setNotes] = useState('');
  const [budget, setBudget] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setServices(mockDb.get('services') || []);
  }, []);

  const handleRequestQuote = (e) => {
    e.preventDefault();
    if (!selectedService) return;

    const quotes = mockDb.get('quotes') || [];
    const newQuote = {
      id: `qte_${Date.now()}`,
      userId: user?.id || 'visitor',
      userName: user?.name || 'Visitante',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      notes,
      budget,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    quotes.push(newQuote);
    mockDb.save('quotes', quotes);

    setNotes('');
    setBudget('');
    setSelectedService(null);
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Nossos Serviços</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Desenvolvimento de soluções sob medida com alta excelência técnica e criativa.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--spacing-xl)' }} className="services-grid-wrapper">
        {/* Services List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {services.map(service => (
            <div key={service.id} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                <img 
                  src={service.images[0]} 
                  alt={service.name} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} 
                />
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{service.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem', lineHeight: '1.5', margin: '4px 0 0' }}>
                    {service.description}
                  </p>
                </div>
              </div>

              {service.included && (
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <strong style={{ color: 'var(--accent)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>O que está incluso:</strong>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {service.included.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        <Check size={14} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.tiers && (
                <div style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--accent)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>Planos Disponíveis:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {service.tiers.map((tier, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                        <span>{tier.name}</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{tier.price}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.note && (
                <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>
                  * {service.note}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Investimento:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent)' }}>{service.priceText}</span>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setSelectedService(service); setSubmitted(false); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  Selecionar <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Request Form */}
        <div className="card">
          <h3>Solicitar Orçamento Personalizado</h3>
          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: 'var(--spacing-md) 0' }} />
          
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
              <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 'var(--spacing-sm)' }} />
              <h4 style={{ color: 'var(--success)' }}>Solicitação Enviada!</h4>
              <p style={{ marginTop: 'var(--spacing-sm)' }}>Recebemos seu pedido de orçamento. Entraremos em contato em breve.</p>
              <button className="btn btn-secondary" style={{ marginTop: 'var(--spacing-md)' }} onClick={() => setSubmitted(false)}>
                Solicitar Outro
              </button>
            </div>
          ) : selectedService ? (
            <form onSubmit={handleRequestQuote} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Serviço Selecionado</label>
                <input type="text" readOnly value={selectedService.name} style={{ width: '100%', padding: 'var(--spacing-sm)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Orçamento Estimado (R$)</label>
                <input type="text" placeholder="Ex: 5000" value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', padding: 'var(--spacing-sm)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Descrição do Projeto / Requisitos</label>
                <textarea rows="4" placeholder="Descreva os requisitos técnicos do seu sistema..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: 'var(--spacing-sm)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Enviar Solicitação</button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--text-secondary)' }}>
              <MessageSquare size={48} style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-muted)' }} />
              <p>Selecione um serviço ao lado para solicitar um orçamento personalizado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
