import React, { useState } from 'react';
import { mockDb } from '../../../services/mockDb';
import { Award, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function VerifyCertificateView() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!code) return;

    const certs = mockDb.get('certificates') || [];
    const found = certs.find(c => c.validation_code.toLowerCase() === code.trim().toLowerCase());
    
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)', maxWidth: '600px' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <Award size={48} style={{ color: 'var(--accent)', marginBottom: 'var(--spacing-xs)' }} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Validador de Certificados</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Verifique a autenticidade de certificações emitidas pela TF Hub.</p>
      </div>

      <form onSubmit={handleVerify} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <label htmlFor="certCode" style={{ fontWeight: 500 }}>Código de Validação</label>
          <input 
            type="text" 
            id="certCode" 
            placeholder="Ex: TF-8392-KJSD" 
            value={code} 
            onChange={(e) => setCode(e.target.value)}
            style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)'
            }}
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Validar Certificado</button>
      </form>

      {searched && (
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          {result ? (
            <div className="card" style={{ borderLeft: '4px solid var(--success)', padding: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--success)', marginBottom: 'var(--spacing-sm)' }}>
                <ShieldCheck size={28} />
                <h3 style={{ fontSize: '1.25rem' }}>Certificado Válido</h3>
              </div>
              <p>Este certificado foi autenticado com sucesso e emitido pela TF Hub Academy.</p>
              <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: 'var(--spacing-md) 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                <div><strong>Aluno:</strong> {result.studentName}</div>
                <div><strong>Instituição:</strong> {result.institution}</div>
                <div><strong>Carga Horária:</strong> {result.hours} horas</div>
                <div><strong>Data de Emissão:</strong> {new Date(result.issueDate).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ borderLeft: '4px solid var(--danger)', padding: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--danger)', marginBottom: 'var(--spacing-sm)' }}>
                <ShieldAlert size={28} />
                <h3 style={{ fontSize: '1.25rem' }}>Certificado Não Encontrado</h3>
              </div>
              <p>O código informado não corresponde a nenhum certificado válido em nossa base de dados. Por favor, verifique a digitação.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
