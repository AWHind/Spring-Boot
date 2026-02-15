'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { mockCustomers, mockPromotions } from '@/lib/mock-data';

export default function AdminCustomersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [customers] = useState(mockCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const handleAddPromo = (customerId: string) => {
    if (promoCode && promoDiscount) {
      alert(`Promotion "${promoCode}" créée pour le client avec ${promoDiscount}% de réduction`);
      setPromoCode('');
      setPromoDiscount('');
      setSelectedCustomerId(null);
    }
  };

  if (!isClient || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Gestion des clients</h1>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nom</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Commandes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total dépensé</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Niveau</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, idx) => (
                  <React.Fragment key={customer.id}>
                    <tr className={idx % 2 === 0 ? 'bg-background' : 'bg-accent/50'}>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{customer.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{customer.totalOrders}</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">{customer.totalSpent.toFixed(2)}dt</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                          {customer.loyaltyTier === 'bronze' && '🥉 Bronze'}
                          {customer.loyaltyTier === 'silver' && '🥈 Silver'}
                          {customer.loyaltyTier === 'gold' && '🥇 Gold'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedCustomerId(selectedCustomerId === customer.id ? null : customer.id)}
                          className="text-primary hover:text-primary/80 font-medium transition-colors text-sm"
                        >
                          {selectedCustomerId === customer.id ? 'Masquer' : 'Promo'}
                        </button>
                      </td>
                    </tr>
                    {selectedCustomerId === customer.id && (
                      <tr className={idx % 2 === 0 ? 'bg-background' : 'bg-accent/50'}>
                        <td colSpan={6} className="px-6 py-4">
                          <div className="bg-muted/20 rounded-lg p-4">
                            <h3 className="font-semibold text-foreground mb-3">Créer une promotion personnalisée</h3>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                placeholder="Code promo"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <input
                                type="number"
                                placeholder="% réduction"
                                value={promoDiscount}
                                onChange={(e) => setPromoDiscount(e.target.value)}
                                className="w-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <button
                                onClick={() => handleAddPromo(customer.id)}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                              >
                                Créer
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
