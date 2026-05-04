"use client";

import { createContext, useContext, useState } from "react";

type CartItem = {
  dish: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (dish: any, qty: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  //////////////////////////////////////
  const addItem = (dish: any, qty: number) => {
    // 🔥 حماية من undefined
    if (!dish || !dish.id) {
      console.warn("Invalid dish:", dish);
      return;
    }

    if (qty <= 0) return;

    setItems(prev => {
      const existing = prev.find(i => i.dish.id === dish.id);

      if (existing) {
        return prev.map(i =>
            i.dish.id === dish.id
                ? { ...i, quantity: i.quantity + qty }
                : i
        );
      }

      return [
        ...prev,
        {
          dish: {
            id: dish.id,
            name: dish.name || "Produit",
            price: dish.price || 0,
            image: dish.image || "/placeholder.png" // 🔥 fallback image
          },
          quantity: qty
        }
      ];
    });
  };

  //////////////////////////////////////
  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.dish.id !== id));
  };

  //////////////////////////////////////
  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }

    setItems(prev =>
        prev.map(i =>
            i.dish.id === id ? { ...i, quantity: qty } : i
        )
    );
  };

  //////////////////////////////////////
  const clearCart = () => setItems([]);

  return (
      <CartContext.Provider
          value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart
          }}
      >
        {children}
      </CartContext.Provider>
  );
}

//////////////////////////////////////
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("CartProvider missing");
  return ctx;
};