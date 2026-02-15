'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useOrders } from '@/lib/contexts/OrderContext';
import { OrderStatus } from '@/lib/types';
import { canCancelOrder, getTimeRemainingForCancellation } from '@/lib/utils';

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳'
  },
  [OrderStatus.VALIDATED]: {
    label: 'Validée',
    color: 'bg-blue-100 text-blue-800',
    icon: '✓'
  },
  [OrderStatus.CANCELLED]: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800',
    icon: '✕'
  },
  [OrderStatus.DELIVERED]: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800',
    icon: '✓✓'
  }
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, cancelOrder, getOrdersByUser } = useOrders();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient && !user) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const userOrders = useMemo(() => {
    if (!user) return [];
    const ordersForUser = getOrdersByUser(user.id);
    console.log('[v0] User:', user.id, 'Orders found:', ordersForUser.length, 'Total orders in system:', orders.length);
    return ordersForUser;
  }, [user, getOrdersByUser, orders]);

  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  // Update countdown timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: Record<string, number> = {};
      userOrders.forEach(order => {
        newTimeRemaining[order.id] = getTimeRemainingForCancellation(order);
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [userOrders]);

  if (!isClient || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mes Commandes</h1>
          <Link
            href="/client/menu"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Nouvelle commande
          </Link>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <svg
              className="w-16 h-16 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune commande
            </h3>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore passé de commande
            </p>
            <Link
              href="/client/menu"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Commencer maintenant
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map(order => {
              const canCancelThis = canCancelOrder(order);
              const timeLeft = timeRemaining[order.id] || 0;
              return (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          Commande {order.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(order.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                          statusConfig[order.status].color
                        }`}
                      >
                        {statusConfig[order.status].icon} {statusConfig[order.status].label}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="bg-accent rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-foreground mb-3">Articles</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-foreground">
                            <span>
                              {item.quantity}x {item.dish.name}
                            </span>
                            <span>{(item.dish.price * item.quantity).toFixed(2)}dt</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    {order.deliveryAddress && (
                      <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground text-sm mb-2">
                          Adresse de livraison
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    )}

                    {/* Special Notes */}
                    {order.notes && (
                      <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground text-sm mb-2">
                          Notes spéciales
                        </h4>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    )}

                    {/* Total & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Total TTC</p>
                        <p className="text-2xl font-bold text-foreground">
                          {order.total.toFixed(2)}dt
                        </p>
                      </div>
                      
                      {/* Cancellation Section */}
                      {order.status === OrderStatus.VALIDATED && (
                        <div className="flex flex-col gap-3">
                          {canCancelThis && timeLeft > 0 ? (
                            <>
                              <button
                                onClick={() => {
                                  if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?\n\nCette action est définitive.')) {
                                    cancelOrder(order.id);
                                  }
                                }}
                                className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:bg-destructive/90 transition-colors shadow-md hover:shadow-lg"
                              >
                                Annuler la commande
                              </button>
                              <div className="text-center">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Délai d'annulation
                                </p>
                                <div className="px-3 py-2 bg-gradient-to-r from-secondary/20 to-accent/20 border border-secondary/30 rounded-lg">
                                  <p className="text-sm font-bold text-secondary">
                                    ⏱ {timeLeft} minute{timeLeft > 1 ? 's' : ''} restante{timeLeft > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-center px-3 py-3 bg-muted/40 border border-muted/60 rounded-lg">
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Annulation non disponible
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Le délai d'annulation de 15 minutes a expiré
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
