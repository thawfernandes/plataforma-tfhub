import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../services/mockDb';
import { Eye, Filter, ExternalLink, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductsListView() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const list = mockDb.get('products') || [];
    setProducts(list);
    setFilteredProducts(list);
  }, []);

  const filterType = (type) => {
    setActiveFilter(type);
    if (type === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.type === type));
    }
  };

  const getTypeName = (type) => {
    const types = {
      system: 'Sistema',
      book: 'Livro Físico',
      ebook: 'eBook',
      template: 'Template',
      digital: 'Produto Digital',
      physical: 'Produto Físico',
      course: 'Curso',
      subscription: 'Assinatura'
    };
    return types[type] || 'Produto';
  };

  const featuredSystem = products.find(p => p.id === 'prod_arrecada' || p.slug === 'tf-arrecada-mais') || products[0];

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Nossos Produtos & Sistemas</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0.5rem auto 0' }}>
          Explore sistemas prontos para uso, cursos e soluções digitais oficiais da TF Hub com entrega e demonstração online imediata.
        </p>
      </div>

      {/* Featured System Spotlight (TF ARRECADA+) */}
      {featuredSystem && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(20, 24, 36, 0.95) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: 'var(--spacing-2xl)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.2)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Sparkles size={14} />
              <span>SISTEMA DESTAQUE EM PRODUÇÃO</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff' }}>
              {featuredSystem.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {featuredSystem.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>Gestão completa de rifas e <strong>realização de sorteios diretamente no próprio sistema</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span><strong>Requisito simples:</strong> só precisa de qualquer dispositivo conectado à internet (celular, tablet ou PC)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>Demonstração online ativa e disponível para testar agora</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={featuredSystem.demoUrl || 'https://thawfernandes.github.io/TF-Arrecada-/login'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  padding: '12px 20px',
                  fontSize: '0.95rem',
                  textDecoration: 'none'
                }}
              >
                <ExternalLink size={18} />
                <span>Entrar no Sistema ({featuredSystem.name})</span>
              </a>

              <Link
                to={`/produtos/${featuredSystem.slug || 'tf-arrecada-mais'}`}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  fontSize: '0.95rem',
                  textDecoration: 'none'
                }}
              >
                <Eye size={16} />
                <span>Ver Detalhes do Produto</span>
              </Link>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to={`/produtos/${featuredSystem.slug || 'tf-arrecada-mais'}`} style={{ display: 'block', textDecoration: 'none' }}>
              <img
                src={featuredSystem.images?.[0]}
                alt={featuredSystem.name}
                style={{
                  width: '100%',
                  maxHeight: '260px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </Link>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-sm)',
        justifyContent: 'center',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <button 
          className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => filterType('all')}
        >
          Todos
        </button>
        <button 
          className={`btn ${activeFilter === 'system' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => filterType('system')}
        >
          Sistemas
        </button>
        <button 
          className={`btn ${activeFilter === 'course' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => filterType('course')}
        >
          Cursos
        </button>
        <button 
          className={`btn ${activeFilter === 'book' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => filterType('book')}
        >
          Livros
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: 'var(--spacing-lg)'
      }}>
        {filteredProducts.map(product => {
          const demoLink = product.demoUrl || product.metadata?.demoUrl || (product.slug === 'tf-arrecada-mais' || product.id === 'prod_arrecada' ? 'https://thawfernandes.github.io/TF-Arrecada-/login' : null);
          const productSlug = product.slug || 'tf-arrecada-mais';

          return (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Link to={`/produtos/${productSlug}`} style={{ textDecoration: 'none', display: 'block', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                <img 
                  src={product.images?.[0]} 
                  alt={product.name} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} 
                />
              </Link>
              <div style={{ padding: 'var(--spacing-sm) 0', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  {getTypeName(product.type)}
                </span>
                <Link to={`/produtos/${productSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ margin: 'var(--spacing-xs) 0' }}>{product.name}</h3>
                </Link>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flexGrow: 1 }}>{product.description}</p>
                
                <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-xs)' }}>
                  {product.promoPrice ? (
                    <>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
                        R$ {product.promoPrice.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        R$ {product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      R$ {product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--spacing-md)' }}>
                  {demoLink && (
                    <a 
                      href={demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        textDecoration: 'none', 
                        textAlign: 'center', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px', 
                        width: '100%', 
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(30, 34, 45, 0.95) 100%)',
                        borderColor: 'rgba(212, 175, 55, 0.5)',
                        color: '#fff'
                      }}
                      title="Acessar o sistema para testar"
                    >
                      <ExternalLink size={14} style={{ color: 'var(--accent)' }} />
                      <span>Conhecer / Entrar no Sistema</span>
                    </a>
                  )}

                  <Link 
                    to={`/produtos/${productSlug}`} 
                    className="btn btn-primary" 
                    style={{ textDecoration: 'none', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                  >
                    <Eye size={16} />
                    <span>Ver Detalhes / Adquirir</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
