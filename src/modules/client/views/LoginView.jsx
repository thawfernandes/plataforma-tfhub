import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { Lock, Mail, User, Phone, ShieldCheck, ArrowRight, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import PhoenixLogo from '../../../components/PhoenixLogo/PhoenixLogo';

export default function LoginView() {
  const { loginWithCredentials, registerClient, login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = loginWithCredentials(loginEmail, loginPassword);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/cliente');
      }
    } else {
      setErrorMsg(res.message || 'Falha ao autenticar.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!registerName.trim() || !registerEmail.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const res = registerClient({
      name: registerName,
      email: registerEmail,
      phone: registerPhone,
      password: registerPassword
    });

    if (res.success) {
      setSuccessMsg('Conta criada com sucesso! Redirecionando para sua área...');
      setTimeout(() => {
        navigate('/cliente');
      }, 1000);
    } else {
      setErrorMsg(res.message || 'Erro ao criar conta.');
    }
  };

  const handleQuickLogin = (role) => {
    login(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/cliente');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 40px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1.5px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div 
        className="card" 
        style={{ 
          maxWidth: '460px', 
          width: '100%', 
          padding: '2.25rem', 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '18px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <PhoenixLogo size={52} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            Plataforma <span style={{ color: 'var(--accent)' }}>TF Hub</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            {activeTab === 'login' ? 'Entre na sua conta para gerenciar e acompanhar' : 'Cadastre-se para acompanhar pedidos e receber novidades'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '10px', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'login' ? 'var(--bg-primary)' : 'transparent',
              color: activeTab === 'login' ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'login' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <LogIn size={16} />
            <span>Entrar</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'register' ? 'var(--bg-primary)' : 'transparent',
              color: activeTab === 'register' ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'register' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <UserPlus size={16} />
            <span>Cadastre-se</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', color: 'var(--success)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                E-mail ou Usuário
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={loginEmail} 
                  onChange={e => setLoginEmail(e.target.value)} 
                  style={inputStyle} 
                  placeholder="admin@tfhub.com.br ou seu e-mail" 
                  required 
                />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                Senha de Acesso
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  style={inputStyle} 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 700, marginTop: '6px' }}>
              <span>Entrar na Plataforma</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER CLIENT */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                Nome Completo
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={registerName} 
                  onChange={e => setRegisterName(e.target.value)} 
                  style={inputStyle} 
                  placeholder="Ex: João da Silva" 
                  required 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                E-mail de Contato
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  value={registerEmail} 
                  onChange={e => setRegisterEmail(e.target.value)} 
                  style={inputStyle} 
                  placeholder="seuemail@gmail.com" 
                  required 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                WhatsApp / Celular
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="tel" 
                  value={registerPhone} 
                  onChange={e => setRegisterPhone(e.target.value)} 
                  style={inputStyle} 
                  placeholder="(11) 99999-9999" 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                Senha de Acesso
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  value={registerPassword} 
                  onChange={e => setRegisterPassword(e.target.value)} 
                  style={inputStyle} 
                  placeholder="Crie uma senha segura" 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 700, marginTop: '6px' }}>
              <span>Criar Minha Conta de Cliente</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Quick Demo Access Bar */}
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.75rem', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Acesso Rápido com 1 Clique (Demonstração)
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="btn btn-secondary"
              style={{ padding: '8px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderColor: 'var(--accent)', color: 'var(--accent)' }}
              title="Acessar como Administrador (TF Admin)"
            >
              <ShieldCheck size={14} />
              <span>Painel Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('client')}
              className="btn btn-secondary"
              style={{ padding: '8px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              title="Acessar como Cliente Demo"
            >
              <User size={14} />
              <span>Cliente Demo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
