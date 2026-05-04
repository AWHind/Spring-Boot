'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { OrderContextType, Order, OrderStatus } from '../types';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* ✅ FETCH ORDERS (FIX ERROR HERE) */
  useEffect(() => {
    fetch("http://localhost:8081/api/orders")
        .then(res => res.json())
        .then(data => {
          console.log("ORDERS:", data);

          // 🔥 الحل للمشكل
          const safeOrders = Array.isArray(data)
              ? data
              : data.content || [];

          setOrders(safeOrders);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setOrders([]);
          setLoading(false);
        });
  }, []);

  /* ✅ PLACE ORDER */
  const placeOrder = useCallback(async (order: Omit<Order, 'id'>) => {
    try {
      const res = await fetch("http://localhost:8081/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      const newOrder = await res.json();

      setOrders(prev => [newOrder, ...prev]);

    } catch (err) {
      console.error(err);
    }
  }, []);

  /* ✅ CANCEL ORDER */
  const cancelOrder = useCallback(async (orderId: number) => {
    try {
      await fetch(`http://localhost:8081/api/orders/${orderId}/cancel`, {
        method: "PUT"
      });

      setOrders(prev =>
          prev.map(order =>
              order.id === orderId
                  ? { ...order, status: OrderStatus.CANCELLED }
                  : order
          )
      );

    } catch (err) {
      console.error(err);
    }
  }, []);

  /* ✅ UPDATE STATUS */
  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatus) => {
    try {
      await fetch(`http://localhost:8081/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      setOrders(prev =>
          prev.map(order =>
              order.id === orderId
                  ? { ...order, status }
                  : order
          )
      );

    } catch (err) {
      console.error(err);
    }
  }, []);

  /* ✅ GET USER ORDERS */
  const getOrdersByUser = useCallback((userId: number) => {
    return orders.filter(order => order.userId === userId);
  }, [orders]);

  /* ✅ GET BY STATUS */
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

/* ✅ HOOK */
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
};