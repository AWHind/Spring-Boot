'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useOrders } from '@/lib/contexts/OrderContext';
import { mockPromotions, mockCustomers } from '@/lib/mock-data';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { getOrdersByUser } = useOrders();
  const [isClient, setIsClient] = React.useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (user && isEditMode) {
      setEditFormData({
        name: user.name,
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [isEditMode, user]);

  React.useEffect(() => {
    if (isClient && !user) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: editFormData.name,
        phone: editFormData.phone,
        address: editFormData.address
      };
      setUser(updatedUser);
      setIsEditMode(false);
    }
  };

  const userOrders = useMemo(() => {
    if (!user) return [];
    return getOrdersByUser(user.id);
  }, [user]);

  const userPromos = useMemo(() => {
    return mockPromotions.filter(p => !p.targetUserId || p.targetUserId === user?.id);
  }, [user]);

  const customerData = useMemo(() => {
    return mockCustomers.find(c => c.id === user?.id);
  }, [user]);

  if (!isClient || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Mon Profil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Info */}
          <div className="lg:col-span-2">
            {/* Account Information */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Informations personnelles</h2>
              
              {!isEditMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Nom complet
                      </label>
                      <p className="text-lg font-semibold text-foreground">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email
                      </label>
                      <p className="text-lg font-semibold text-foreground">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Téléphone
                      </label>
                      <p className="text-lg font-semibold text-foreground">
                        {user.phone || 'Non renseigné'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Adresse
                      </label>
                      <p className="text-sm text-foreground">
                        {user.address || 'Non renseignée'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
                  >
                    Modifier mes informations
                  </button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-border bg-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email (Non modifiable)
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3 py-2 border border-border bg-muted rounded-lg text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-border bg-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={editFormData.address}
                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-border bg-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="px-6 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted/30 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Loyalty & Stats */}
            {customerData && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Statut de fidélité</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{customerData.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Commandes</p>
                  </div>
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{customerData.totalSpent.toFixed(2)}dt</p>
                    <p className="text-sm text-muted-foreground">Dépensé</p>
                  </div>
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-secondary capitalize">
                      {customerData.loyaltyTier === 'bronze' && '🥉 Bronze'}
                      {customerData.loyaltyTier === 'silver' && '🥈 Silver'}
                      {customerData.loyaltyTier === 'gold' && '🥇 Gold'}
                    </p>
                    <p className="text-sm text-muted-foreground">Niveau</p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Avantages de votre niveau</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {customerData.loyaltyTier === 'gold' && (
                      <>
                        <li>✓ 15% de réduction sur toutes les commandes</li>
                        <li>✓ Livraison gratuite</li>
                        <li>✓ Accès aux offres VIP</li>
                        <li>✓ Support prioritaire</li>
                      </>
                    )}
                    {customerData.loyaltyTier === 'silver' && (
                      <>
                        <li>✓ 10% de réduction sur toutes les commandes</li>
                        <li>✓ Livraison gratuite dès 30€</li>
                        <li>✓ Offres exclusives mensuelles</li>
                      </>
                    )}
                    {customerData.loyaltyTier === 'bronze' && (
                      <>
                        <li>✓ 5% de réduction sur la première commande</li>
                        <li>✓ Accès aux promotions saisonnières</li>
                        <li>✓ Newsletter spéciale</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Order History */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Historique des commandes</h2>
              
              {userOrders.length === 0 ? (
                <p className="text-muted-foreground">Aucune commande trouvée</p>
              ) : (
                <div className="space-y-2">
                  {userOrders.slice(0, 5).map(order => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-accent rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }).format(order.createdAt)}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {order.total.toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Promotions */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-foreground mb-4">Promotions actives</h2>
              
              {userPromos.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Aucune promotion active actuellement
                </p>
              ) : (
                <div className="space-y-3">
                  {userPromos.map(promo => (
                    <div
                      key={promo.id}
                      className="border-2 border-secondary rounded-lg p-3 bg-secondary/5"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-foreground text-sm">
                          {promo.code}
                        </h3>
                        <span className="text-secondary font-bold text-lg">
                          -{promo.discountPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {promo.description}
                      </p>
                      <button className="w-full px-2 py-1 bg-secondary text-white rounded text-xs font-medium hover:bg-secondary/90 transition-colors">
                        Copier le code
                      </button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Valide jusqu'au {new Intl.DateTimeFormat('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }).format(promo.endDate)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
