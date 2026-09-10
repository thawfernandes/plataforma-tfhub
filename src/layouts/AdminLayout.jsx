import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Briefcase, FileText, FolderGit, 
  Award, MessageSquare, Settings, Users, LogOut, Home, HelpCircle,
  Menu, X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { PwaInstallPrompt } from '../components/index';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Produtos', path: '/admin/produtos', icon: <ShoppingBag size={18} /> },
    { label: 'Solicitações Vendas', path: '/admin/pedidos', icon: <ShoppingBag size={18} /> },
    { label: 'Serviços & Leads', path: '/admin/servicos', icon: <Briefcase size={18} /> },
    { label: 'Publicações', path: '/admin/conteudo', icon: <FileText size={18} /> },
    { label: 'Portfólio', path: '/admin/portfolio', icon: <FolderGit size={18} /> },
    { label: 'Equipe', path: '/admin/equipe', icon: <Users size={18} /> },
    { label: 'Certificados', path: '/admin/certificados', icon: <Award size={18} /> },
    { label: 'Depoimentos', path: '/admin/depoimentos', icon: <MessageSquare size={18} /> },
    { label: 'FAQ', path: '/admin/faq', icon: <HelpCircle size={18} /> },
    { label: 'Configurações', path: '/admin/configuracoes', icon: <Settings size={18} /> }
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className={styles.backdrop} 
          onClick={() => setSidebarOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <span>TF HUB Admin</span>
          </Link>
          <button 
            className={styles.closeMobileSidebar} 
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.path} 
              className={`${styles.navLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.footerActions}>
          <Link to="/" className={styles.navLink} onClick={() => setSidebarOpen(false)}>
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
            <button 
              className={styles.menuToggle} 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menu de navegação"
            >
              <Menu size={22} />
            </button>
            <h2>Painel Admin</h2>
          </div>

          <div className={styles.topbarRight}>
            <PwaInstallPrompt compact={true} />
            <div className={styles.adminProfile}>
              <img src={user?.avatar} alt={user?.name} className={styles.avatar} />
              <div className={styles.profileDetails}>
                <span className={styles.name}>{user?.name?.split(' ')[0]}</span>
                <span className={styles.role}>Admin</span>
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
