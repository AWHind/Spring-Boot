'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { OrderContextType, Order, OrderStatus } from '../types';
import { canCancelOrder } from '../utils';
import { mockOrders } from '../mock-data';

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_STORAGE_KEY = 'restaurant_orders';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders, (key, value) => {
          // Convert date strings back to Date objects
          if (key === 'createdAt' || key === 'updatedAt' || key === 'canCancelUntil') {
            return new Date(value);
          }
          return value;
        });
        setOrders(parsedOrders);
      } catch (error) {
        console.error('[v0] Error loading orders from localStorage:', error);
        localStorage.removeItem(ORDERS_STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  const placeOrder = useCallback((order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const canCancelUntil = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now
    
    const newOrder: Order = {
      ...order,
      id: `order${orders.length + 1}`,
      createdAt: now,
      updatedAt: now,
      canCancelUntil
    };
    setOrders(prev => [newOrder, ...prev]);
  }, [orders.length]);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          // Check if order can be cancelled (within 15-minute window)
          if (!canCancelOrder(order)) {
            console.warn('[v0] Order cannot be cancelled: outside 15-minute window or not in VALIDATED status');
            return order;
          }
          return { ...order, status: OrderStatus.CANCELLED, updatedAt: new Date() };
        }
        return order;
      })
    );
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
  }, []);

  const getOrdersByUser = useCallback((userId: string) => {
    return orders.filter(order => order.userId === userId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const value: OrderContextType = {
    orders,
    placeOrder,
    cancelOrder,
    updateOrderStatus,
    getOrdersByUser,
    getOrdersByStatus
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
