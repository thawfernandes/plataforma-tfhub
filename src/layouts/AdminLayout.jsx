import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Briefcase, FileText, FolderGit, 
  Award, MessageSquare, Settings, Users, LogOut, Home, HelpCircle 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { PwaInstallPrompt } from '../components/index';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Produtos', path: '/admin/produtos', icon: <ShoppingBag size={18} /> },
    { label: 'Serviços & Leads', path: '/admin/servicos', icon: <Briefcase size={18} /> },
    { label: 'Publicações', path: '/admin/conteudo', icon: <FileText size={18} /> },
    { label: 'Portfólio', path: '/admin/portfolio', icon: <FolderGit size={18} /> },
    { label: 'Certificados', path: '/admin/certificados', icon: <Award size={18} /> },
    { label: 'Depoimentos', path: '/admin/depoimentos', icon: <MessageSquare size={18} /> },
    { label: 'FAQ', path: '/admin/faq', icon: <HelpCircle size={18} /> },
    { label: 'Configurações', path: '/admin/configuracoes', icon: <Settings size={18} /> }
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <span>TF HUB Admin</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.path} 
              className={`${styles.navLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.footerActions}>
          <Link to="/" className={styles.navLink}>
            <Home size={18} />
            <span>Voltar ao Site</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h2>Painel de Controle</h2>
          </div>
          <div className={styles.topbarRight} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PwaInstallPrompt compact={true} />
            <div className={styles.adminProfile}>
              <img src={user?.avatar} alt={user?.name} className={styles.avatar} />
              <div className={styles.profileDetails}>
                <span className={styles.name}>{user?.name}</span>
                <span className={styles.role}>Administrador</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className={styles.viewWrapper}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
