import React, { createContext, useState, useEffect } from 'react';
import { mockDb } from '../services/mockDb';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('tf_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tf_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.promoPrice || item.price;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const checkout = (userOrId) => {
    if (cartItems.length === 0) return null;
    
    const userId = typeof userOrId === 'object' ? userOrId?.id : userOrId;
    const clientEmail = typeof userOrId === 'object' ? userOrId?.email?.trim().toLowerCase() : '';
    const clientName = typeof userOrId === 'object' ? userOrId?.name : '';

    const orders = mockDb.get('orders') || [];
    const newOrder = {
      id: `ord_${Date.now()}`,
      userId: userId || 'anonymous',
      clientEmail: clientEmail || '',
      clientName: clientName || '',
      items: cartItems,
      total: cartTotal,
      status: 'Pagamento aprovado', // Cart checkout default
      timeline: [
        { title: 'Pedido realizado', date: new Date().toISOString(), description: 'Compra finalizada pelo carrinho com sucesso.' },
        { title: 'Pagamento aprovado', date: new Date().toISOString(), description: 'Acesso e downloads liberados.' }
      ],
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    orders.unshift(newOrder);
    mockDb.save('orders', orders);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};
