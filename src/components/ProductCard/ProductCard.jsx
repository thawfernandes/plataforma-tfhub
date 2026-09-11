import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Zap, ExternalLink, Eye } from 'lucide-react';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';
import { CartContext } from '../../context/CartContext';
import { useToast } from '../Toast/Toast';
import styles from './ProductCard.module.css';

const TYPE_LABELS = {
  system:       { label: 'Sistema',         variant: 'primary' },
  book:         { label: 'Livro',           variant: 'default' },
  ebook:        { label: 'eBook',           variant: 'accent' },
  template:     { label: 'Template',        variant: 'accent' },
  digital:      { label: 'Digital',         variant: 'accent' },
  physical:     { label: 'Físico',          variant: 'default' },
  course:       { label: 'Curso',           variant: 'success' },
  subscription: { label: 'Assinatura',      variant: 'warning' },
};

/**
 * ProductCard — card comercial de produto
 * @param {object}   product      — item do mockDb
 * @param {boolean}  instantBuy   — se true, exibe botão "1 Clique" (usuário logado)
 * @param {function} onInstantBuy — callback para compra imediata
 */
export default function ProductCard({ product, instantBuy = false, onInstantBuy }) {
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const typeInfo = TYPE_LABELS[product.type] || { label: product.type, variant: 'default' };
  const price = product.promoPrice || product.price;
  const hasPromo = !!product.promoPrice;
  const productSlug = product.slug || 'tf-arrecada-mais';
  const demoLink = product.demoUrl || product.metadata?.demoUrl || (product.slug === 'tf-arrecada-mais' || product.id === 'prod_arrecada' ? 'https://thawfernandes.github.io/TF-Arrecada-/login' : null);

  const handleAddToCart = (e) => {
    e?.stopPropagation?.();
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <article className={styles.card}>
      <Link to={`/produtos/${productSlug}`} className={styles.imageWrapper} title={`Ver detalhes de ${product.name}`}>
        <img src={product.images?.[0]} alt={product.name} className={styles.image} loading="lazy" />
        <div className={styles.badgeOverlay}>
          <Badge variant={typeInfo.variant} size="sm">{typeInfo.label}</Badge>
          {hasPromo && <Badge variant="danger" size="sm">Promo</Badge>}
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <Link to={`/produtos/${productSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 className={styles.name}>{product.name}</h3>
          </Link>
          <p className={styles.description}>{product.description}</p>
        </div>

        <div className={styles.pricing}>
          <span className={styles.price}>R$ {price.toFixed(2)}</span>
          {hasPromo && (
            <span className={styles.originalPrice}>R$ {product.price.toFixed(2)}</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
          {demoLink && (
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontWeight: 700,
                textDecoration: 'none',
                width: '100%',
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

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              to={`/produtos/${productSlug}`}
              className="btn btn-primary btn-sm"
              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <Eye size={14} />
              <span>Ver Detalhes</span>
            </Link>

            {instantBuy && onInstantBuy ? (
              <Button
                variant="accent"
                size="sm"
                iconLeft={<Zap size={14} />}
                onClick={() => onInstantBuy(product)}
                title="Comprar agora sem carrinho"
              >
                1 Clique
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                iconLeft={<ShoppingCart size={14} />}
                onClick={handleAddToCart}
                title="Adicionar ao carrinho"
              >
                Carrinho
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
