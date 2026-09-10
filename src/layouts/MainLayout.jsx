import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import PhoenixLogo from '../components/PhoenixLogo/PhoenixLogo';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('tf_theme') || 'dark');
  const [menus, setMenus] = useState([]);
  const [footer, setFooter] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Dynamic loading from local mock DB
    setMenus(mockDb.get('menus') || []);
    setFooter(mockDb.get('footer'));
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tf_theme', theme);
  }, [theme]);

  // Smooth scroll to hash when URL has hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  const handleMenuClick = (e, path) => {
    const sectionMap = {
      '/': 'top',
      '/produtos': 'produtos',
      '/servicos': 'servicos',
      '/portfolio': 'portfolio',
      '/conteudo': 'conteudo',
      '/sobre-nos': 'sobre-nos',
      '/#sobre-nos': 'sobre-nos',
      '/contato': 'contato',
      '/#contato': 'contato'
    };

    const sectionId = sectionMap[path];

    if (sectionId) {
      if (location.pathname === '/') {
        e.preventDefault();
        setMobileMenuOpen(false);
        if (sectionId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        e.preventDefault();
        setMobileMenuOpen(false);
        if (sectionId === 'top') {
          navigate('/');
        } else {
          navigate(`/#${sectionId}`);
        }
      }
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.appContainer}>
      {/* Header / Navbar */}
      <header className={styles.header}>
        <div className={`container ${styles.navWrapper}`}>
          <Link 
            to="/" 
            className={styles.logo}
            onClick={(e) => handleMenuClick(e, '/')}
          >
            <PhoenixLogo size={38} />
            <span className={styles.logoText}>TF HUB</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {menus.map(item => (
              <Link 
                key={item.id} 
                to={item.path} 
                className={`${styles.navLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
                onClick={(e) => handleMenuClick(e, item.path)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button onClick={toggleTheme} className={styles.iconBtn} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/carrinho" className={styles.cartBtn} aria-label="Cart">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && <span className={styles.badge}>{cartItems.length}</span>}
            </Link>

            {user ? (
              <div className={styles.userMenu}>
                <Link to={user.role === 'admin' ? '/admin' : '/cliente'} className={styles.userBtn}>
                  <img src={user.avatar} alt={user.name} className={styles.avatar} />
                  <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className={styles.iconBtn} title="Sair">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                <User size={18} />
                <span>Entrar</span>
              </Link>
            )}

            <button 
              className={styles.mobileToggle} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {menus.map(item => (
              <Link 
                key={item.id} 
                to={item.path} 
                className={`${styles.mobileNavLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
                onClick={(e) => handleMenuClick(e, item.path)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link 
                to={user.role === 'admin' ? '/admin' : '/cliente'} 
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Minha Conta ({user.name})
              </Link>
            ) : (
              <Link 
                to="/login" 
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar / Login
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Main Page Content */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Dynamic Footer */}
      {footer && (
        <footer className={styles.footer}>
          <div className="container">
            <div className={styles.footerGrid}>
              <div className={styles.footerBrand}>
                <div className={styles.logo}>
                  <PhoenixLogo size={30} />
                  <span className={styles.logoText}>TF HUB</span>
                </div>
                <p className={styles.footerAbout}>{footer.aboutText}</p>
              </div>
              <div className={styles.footerLinks}>
                <h4>Navegação</h4>
                <ul>
                  {footer.links.map((link, idx) => (
                    <li key={idx}>
                      <Link 
                        to={link.path}
                        onClick={(e) => handleMenuClick(e, link.path)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.footerBottom}>
              <p>{footer.copyright}</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
