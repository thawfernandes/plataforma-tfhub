import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import { AuthContext } from '../../../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartView() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, checkout } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Por favor, faça login para finalizar a compra!');
      navigate('/login');
      return;
    }
    const order = checkout(user);
    if (order) {
      alert('Compra finalizada com sucesso! Acompanhe seu pedido na Área do Cliente.');
      navigate('/cliente');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
        <h2>Seu carrinho está vazio</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
          Navegue pelo nosso catálogo de produtos e adicione itens ao seu carrinho.
        </p>
        <button className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }} onClick={() => navigate('/produtos')}>
          Ver Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Meu Carrinho</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--spacing-xl)' }}>
        {/* Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {cartItems.map(item => {
            const itemPrice = item.promoPrice || item.price;
            return (
              <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1.1rem' }}>{item.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>R$ {itemPrice.toFixed(2)}</span>
                </div>
                
                {/* Quantity adjustments */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                  <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <button 
                  style={{ color: 'var(--danger)', padding: 'var(--spacing-xs)' }}
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Checkout Summary */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3>Resumo do Pedido</h3>
          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: 'var(--spacing-md) 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <strong>R$ {cartTotal.toFixed(2)}</strong>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
            <span>Finalizar Compra</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
