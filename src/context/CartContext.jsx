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

  const checkout = (userId) => {
    if (cartItems.length === 0) return null;
    
    const orders = mockDb.get('orders') || [];
    const newOrder = {
      id: `ord_${Date.now()}`,
      userId: userId || 'anonymous',
      items: cartItems,
      total: cartTotal,
      status: 'pending', // pending, completed, cancelled
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
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
