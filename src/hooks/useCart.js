import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on init
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (err) {
      return [];
    }
  });

  // Persist cart in localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, callback) => {
    setCart(prev => {
      const id = product._id || product.id;
      const existing = prev.find(item => (item._id || item.id) === id);

      if (existing) {
        return prev.map(item =>
          (item._id || item.id) === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity }];
    });

    if (callback) callback();
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        (item._id || item.id) === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.sellingPrice || item.price || 0) * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => setCart([]);

  return {
    cart,
    setCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  };
};
