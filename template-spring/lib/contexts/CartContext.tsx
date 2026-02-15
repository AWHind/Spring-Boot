'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CartContextType, CartItem, Dish } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.20; // 20% tax
const CART_STORAGE_KEY = 'restaurant_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('[v0] Error loading cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  }, [items]);

  const tax = useMemo(() => {
    return parseFloat((subtotal * TAX_RATE).toFixed(2));
  }, [subtotal]);

  const total = useMemo(() => {
    return parseFloat((subtotal + tax).toFixed(2));
  }, [subtotal, tax]);

  const addItem = useCallback((dish: Dish, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        return prev.map(item =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { dish, quantity }];
    });
  }, []);

  const removeItem = useCallback((dishId: string) => {
    setItems(prev => prev.filter(item => item.dish.id !== dishId));
  }, []);

  const updateQuantity = useCallback((dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.dish.id === dishId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const value: CartContextType = {
    items,
    total,
    tax,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
