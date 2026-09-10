import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ServiceCard, Modal, Textarea, Input, Button } from '../../../components/index';
import { useToast } from '../../../components/Toast/Toast';
import { mockDb } from '../../../services/mockDb';
import styles from './SectionShared.module.css';

export default function ServicesSection({ services }) {
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleQuote = (service) => {
    setSelected(service);
    setForm({ name: '', email: '', message: '' });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error('Preencha nome e e-mail para continuar.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simula envio
    mockDb.addItem('quotes', {
      serviceId: selected.id,
      serviceName: selected.name,
      ...form,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    toast.success('Orçamento enviado! Retornaremos em até 24 horas.');
    setLoading(false);
    setSelected(null);
  };

  return (
    <section className={styles.section} id="servicos">
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Serviços</p>
            <h2 className={styles.sectionTitle}>Projetos desenvolvidos para você</h2>
            <p className={styles.sectionSubtitle}>
              Soluções personalizadas com 50% de entrada e entrega planejada.
            </p>
          </div>
          <Link to="/servicos" className={styles.seeAll}>
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.grid3}>
          {services.map(s => (
            <ServiceCard key={s.id} service={s} onRequestQuote={handleQuote} />
          ))}
        </div>
      </div>

      {/* Quote Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Orçamento: ${selected?.name || ''}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Cancelar</Button>
            <Button variant="primary" loading={loading} onClick={handleSubmit}>Enviar Orçamento</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Preencha os dados abaixo e nossa equipe entrará em contato em até <strong>24 horas</strong>.
          </p>
          <Input
            label="Seu nome"
            placeholder="Como devemos te chamar?"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
          <Textarea
            label="Descreva seu projeto"
            placeholder="O que você precisa? Quanto maior o detalhe, mais preciso será o orçamento."
            value={form.message}
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            rows={4}
          />
          <div style={{
            background: 'rgba(0,240,255,0.06)',
            border: '1px solid rgba(0,240,255,0.15)',
            borderRadius: 10,
            padding: '0.875rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            💡 <strong>Como funciona:</strong> Após análise, enviamos uma proposta formal. Projetos aprovados exigem 50% de entrada para início do desenvolvimento.
          </div>
        </div>
      </Modal>
    </section>
  );
}
