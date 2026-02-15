'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useOrders } from '@/lib/contexts/OrderContext';
import { OrderStatus } from '@/lib/types';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, tax, total, removeItem, updateQuantity, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [hasHydrated, setHasHydrated] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setHasHydrated(true);
  }, []);

  React.useEffect(() => {
    if (isClient && !user && hasHydrated) {
      router.push('/login');
    }
  }, [isClient, user, router, hasHydrated]);

  const handlePlaceOrder = async () => {
    if (!user || !deliveryAddress) {
      alert('Veuillez remplir l\'adresse de livraison');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('[v0] Placing order for user:', user.id, 'with', items.length, 'items');
      placeOrder({
        userId: user.id,
        items,
        status: OrderStatus.VALIDATED,
        subtotal,
        tax,
        total,
        deliveryAddress,
        notes
      });

      clearCart();
      console.log('[v0] Order placed successfully, redirecting to orders page');
      router.push('/client/orders');
    } catch (error) {
      alert('Erreur lors de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isClient || !user || !hasHydrated) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin text-foreground">Chargement...</div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Mon Panier</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2 9m-12 0h12"
              />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Votre panier est vide
            </h3>
            <p className="text-muted-foreground mb-6">
              Commencez à ajouter des plats pour créer votre commande
            </p>
            <Link
              href="/client/menu"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continuer les achats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {items.map(item => (
                  <div
                    key={item.dish.id}
                    className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors"
                  >
                    {/* Image Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-primary/30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                      </svg>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{item.dish.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.dish.price.toFixed(2)}dt Featured Dishes
                        l'unité</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                        className="px-2 py-1 text-foreground hover:bg-accent transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                        className="px-2 py-1 text-foreground hover:bg-accent transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-[5rem]">
                      <p className="font-bold text-foreground">
                        {(item.dish.price * item.quantity).toFixed(2)}dt
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.dish.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold text-foreground mb-6">Résumé de la commande</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-foreground">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)}dt</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Taxes (20%)</span>
                    <span>{tax.toFixed(2)}dt</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>{total.toFixed(2)}dt</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Adresse de livraison
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Votre adresse complète"
                  />
                </div>

                {/* Special Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notes spéciales (optionnel)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={2}
                    placeholder="Allergies, préférences, etc."
                  />
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Traitement...' : 'Confirmer la commande'}
                </button>

                <Link
                  href="/client/menu"
                  className="block text-center mt-3 text-primary hover:text-primary/90 font-medium transition-colors"
                >
                  Continuer les achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
