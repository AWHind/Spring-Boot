'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { mockPromotions } from '@/lib/mock-data';

export default function AdminPromotionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [promotions, setPromotions] = useState(mockPromotions);
  const [showForm, setShowForm] = useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercentage: ''
  });

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const handleAddPromo = () => {
    if (formData.code && formData.description && formData.discountPercentage) {
      const newPromo = {
        id: `promo${promotions.length + 1}`,
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountPercentage: parseInt(formData.discountPercentage),
        active: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      };
      setPromotions([...promotions, newPromo]);
      setFormData({ code: '', description: '', discountPercentage: '' });
      setShowForm(false);
    }
  };

  const handleDeletePromo = (id: string) => {
    if (confirm('Êtes-vous sûr ?')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setPromotions(promotions.map(p =>
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  if (!isClient || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gestion des promotions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {showForm ? 'Annuler' : 'Nouvelle promotion'}
          </button>
        </div>

        {/* Add Promotion Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Nouvelle promotion</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Code (ex: NOEL25)"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="% réduction"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary md:col-span-3"
                rows={2}
              />
            </div>
            <button
              onClick={handleAddPromo}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Créer la promotion
            </button>
          </div>
        )}

        {/* Promotions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map(promo => (
            <div
              key={promo.id}
              className="bg-card border-2 border-secondary rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{promo.code}</h3>
                  <p className="text-xs text-muted-foreground">
                    Jusqu'au {new Intl.DateTimeFormat('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }).format(promo.endDate)}
                  </p>
                </div>
                <span className="text-2xl font-bold text-secondary">-{promo.discountPercentage}%</span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{promo.description}</p>

              <div className="space-y-2">
                <button
                  onClick={() => handleToggleActive(promo.id)}
                  className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    promo.active
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {promo.active ? 'Actif' : 'Inactif'}
                </button>
                <button
                  onClick={() => handleDeletePromo(promo.id)}
                  className="w-full px-3 py-2 border border-destructive text-destructive rounded-lg font-medium hover:bg-destructive/10 transition-colors text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
