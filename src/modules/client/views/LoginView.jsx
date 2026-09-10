import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

export default function LoginView() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/cliente');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: 'var(--spacing-lg)', textAlign: 'center' }} className="card">
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Acessar Plataforma</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
        Selecione o perfil desejado para acessar a área restrita:
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <button className="btn btn-primary" onClick={() => handleLogin('client')}>
          Acessar como Cliente (Thiago Alencar)
        </button>
        
        <button className="btn btn-accent" onClick={() => handleLogin('admin')}>
          Acessar como Administrador (TF Hub Admin)
        </button>
      </div>
    </div>
  );
}
