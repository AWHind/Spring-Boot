'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DishCard } from '@/components/dishes/DishCard';
import { mockDishes } from '@/lib/mock-data';

type Category = 'all' | 'appetizers' | 'main' | 'desserts' | 'beverages' | 'specials';

const categoryLabels: Record<Category, string> = {
  all: 'Tous les plats',
  appetizers: 'Entrées',
  main: 'Plats principaux',
  desserts: 'Desserts',
  beverages: 'Boissons',
  specials: 'Spécialités'
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDishes = useMemo(() => {
    return mockDishes.filter(dish => {
      const matchesCategory =
          selectedCategory === 'all' || dish.category === selectedCategory;

      const matchesSearch =
          dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch && dish.available;
    });
  }, [selectedCategory, searchQuery]);

  return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        {/* HERO */}
        <section className="bg-gray-50 py-24 px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              L’Art Culinaire

          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une expérience culinaire raffinée préparée avec passion et excellence.
          </p>

          {/* SEARCH */}
          <div className="max-w-xl mx-auto mt-10">
            <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 transition-all text-lg shadow-md"
            />
          </div>
        </section>

        {/* FILTER */}
        <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-5 flex gap-3 overflow-x-auto">
            {(Object.entries(categoryLabels) as [Category, string][]).map(
                ([category, label]) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            selectedCategory === category
                                ? 'bg-[#FF6B35] text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {label}
                    </button>
                )
            )}
          </div>
        </section>

        {/* GRID */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16">
          {filteredDishes.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-900">
                  Aucun plat trouvé
                </h3>
                <p className="text-gray-600 mt-2">
                  Essayez de modifier votre recherche.
                </p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
          )}
        </main>

        <Footer />
      </div>
  );
}
