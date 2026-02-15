'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { mockDishes } from '@/lib/mock-data';

export default function AdminMenuPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [dishes, setDishes] = useState(mockDishes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main' as const
  });

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const handleAddDish = () => {
    if (formData.name && formData.description && formData.price) {
      const newDish = {
        id: `dish${dishes.length + 1}`,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: '/dish-default.jpg',
        category: formData.category,
        available: true,
        rating: 4.5,
        reviews: 0
      };
      setDishes([...dishes, newDish]);
      setFormData({ name: '', description: '', price: '', category: 'main' });
      setShowForm(false);
    }
  };

  const handleDeleteDish = (id: string) => {
    if (confirm('Êtes-vous sûr ?')) {
      setDishes(dishes.filter(d => d.id !== id));
    }
  };

  const handleToggleAvailable = (id: string) => {
    setDishes(dishes.map(d =>
      d.id === id ? { ...d, available: !d.available } : d
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
          <h1 className="text-3xl font-bold text-foreground">Gestion du Menu</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {showForm ? 'Annuler' : 'Ajouter un plat'}
          </button>
        </div>

        {/* Add Dish Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Nouveau plat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du plat"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Prix"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="appetizers">Entrées</option>
                <option value="main">Plats</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Boissons</option>
                <option value="specials">Spécialités</option>
              </select>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
                rows={2}
              />
            </div>
            <button
              onClick={handleAddDish}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Ajouter
            </button>
          </div>
        )}

        {/* Dishes Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Plat</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Catégorie</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Prix</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Note</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Disponible</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish, idx) => (
                  <tr key={dish.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-accent/50'}>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{dish.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {dish.category === 'appetizers' && 'Entrées'}
                      {dish.category === 'main' && 'Plats'}
                      {dish.category === 'desserts' && 'Desserts'}
                      {dish.category === 'beverages' && 'Boissons'}
                      {dish.category === 'specials' && 'Spécialités'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">{dish.price.toFixed(2)}dt</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {dish.rating.toFixed(1)}/5 ({dish.reviews} avis)
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailable(dish.id)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          dish.available
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {dish.available ? 'Disponible' : 'Indisponible'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteDish(dish.id)}
                        className="text-destructive hover:text-destructive/80 font-medium transition-colors"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
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
