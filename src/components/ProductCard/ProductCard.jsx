import React, { useContext } from 'react';
import { ShoppingCart, Zap, ExternalLink } from 'lucide-react';
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

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={product.images[0]} alt={product.name} className={styles.image} loading="lazy" />
        <div className={styles.badgeOverlay}>
          <Badge variant={typeInfo.variant} size="sm">{typeInfo.label}</Badge>
          {hasPromo && <Badge variant="danger" size="sm">Promo</Badge>}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.pricing}>
            <span className={styles.price}>R$ {price.toFixed(2)}</span>
            {hasPromo && (
              <span className={styles.originalPrice}>R$ {product.price.toFixed(2)}</span>
            )}
          </div>

          <div className={styles.actions}>
            {instantBuy && onInstantBuy && (
              <Button
                variant="accent"
                size="sm"
                iconLeft={<Zap size={14} />}
                onClick={() => onInstantBuy(product)}
                title="Comprar agora sem carrinho"
              >
                1 Clique
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<ShoppingCart size={14} />}
              onClick={handleAddToCart}
            >
              {instantBuy ? 'Carrinho' : 'Comprar'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
