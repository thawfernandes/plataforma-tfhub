import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../services/mockDb';
import { Eye, Filter, ExternalLink } from 'lucide-react';
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

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Nossos Produtos</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore sistemas, livros, cursos e produtos físicos e digitais oficiais da TF Hub.</p>
      </div>

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
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--spacing-lg)'
      }}>
        {filteredProducts.map(product => {
          const demoLink = product.demoUrl || product.metadata?.demoUrl || (product.slug === 'tf-arrecada-mais' || product.id === 'prod_arrecada' ? 'https://thawfernandes.github.io/TF-Arrecada-/login' : null);

          return (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <img 
                src={product.images[0]} 
                alt={product.name} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
              />
              <div style={{ padding: 'var(--spacing-sm) 0', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  {getTypeName(product.type)}
                </span>
                <h3 style={{ margin: 'var(--spacing-xs) 0' }}>{product.name}</h3>
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
                      style={{ textDecoration: 'none', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', fontWeight: 700 }}
                    >
                      <ExternalLink size={14} style={{ color: 'var(--accent)' }} />
                      <span>Conhecer / Entrar no Sistema</span>
                    </a>
                  )}

                  <Link 
                    to={`/produtos/${product.slug}`} 
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
