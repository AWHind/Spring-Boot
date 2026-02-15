'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockDishes } from '@/lib/mock-data';
import { useAuth } from '@/lib/contexts/AuthContext';

const categories = [
  { name: 'Toute la carte', icon: '🍽️' },
  { name: 'Entrées', icon: '🥗' },
  { name: 'Plats principaux', icon: '🍖' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Boissons', icon: '🥤' },
  { name: 'Spécialités', icon: '⭐' }
];
/* -------- NORMALIZE -------- */
const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/* -------- IMAGE FUNCTION -------- */
const getDishImage = (name: string): string => {
  const lower = normalize(name);

  if (lower.includes("soupe")) return "/image/soupe-oignon.jpg";
  if (lower.includes("salade")) return "/image/salade-nicoise.jpg";
  if (lower.includes("foie")) return "/image/hgras.jpg";
  if (lower.includes("escargot")) return "/image/escargots.jpg";
  if (lower.includes("huitre")) return "/image/huitres.jpg";
  if (lower.includes("terrine")) return "/image/terrine-foie-gras.jpg";
  if (lower.includes("coq")) return "/image/coq-au-vin.jpg";
  if (lower.includes("rossini")) return "/image/filet-boeuf-rossini.jpg";
  if (lower.includes("sole")) return "/image/sole-meuniere.jpg";
  if (lower.includes("homard")) return "/image/homard-thermidor.jpg";
  if (lower.includes("magret")) return "/image/magret-canard.jpg";
  if (lower.includes("bouillabaisse")) return "/image/bouillabaisse.jpg";
  if (lower.includes("ratatouille")) return "/image/ratatouille.jpg";
  if (lower.includes("confit")) return "/image/confit-canard.jpg";
  if (lower.includes("veau")) return "/image/cote-veau.jpg";
  if (lower.includes("creme")) return "/image/creme-brulee.jpg";
  if (lower.includes("tarte")) return "/image/tarte-tatin.jpg";
  if (lower.includes("mousse")) return "/image/mousse-chocolat.jpg";
  if (lower.includes("mille")) return "/image/mille-feuille.jpg";
  if (lower.includes("souffle")) return "/image/souffle.jpg";
  if (lower.includes("panna")) return "/image/panna-cotta.jpg";
  if (lower.includes("champagne")) return "/image/champagne-rose.jpg";
  if (lower.includes("vin rouge")) return "/image/vin-rouge.jpg";
  if (lower.includes("vin blanc")) return "/image/vin-blanc.jpg";
  if (lower.includes("jus")) return "/image/jus-orange.jpg";
  if (lower.includes("expresso")) return "/image/espresso.jpg";
  if (lower.includes("cidre")) return "/image/cidre.jpg";
  if (lower.includes("fromage")) return "/image/plateau-fromages.jpg";
  if (lower.includes("charcuterie")) return "/image/plateau-charcuterie.jpg";
  if (lower.includes("degustation")) return "/image/degustation.jpg";
  if (lower.includes("vegetarien")) return "/image/menu-vegetarien.jpg";
  if (lower.includes("chef")) return "/image/menu-chef.jpg";

  return "/image/default.jpg";
};

export default function PublicMenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const filteredDishes = useMemo(() => {
    return mockDishes.filter(dish =>
        normalize(dish.name).includes(normalize(searchQuery)) ||
        normalize(dish.description).includes(normalize(searchQuery))
    );
  }, [searchQuery]);

  return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        {/* HERO */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
                src="/image/hero-menu.jpg"
                alt="Restaurant"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900">
              Nos Créations Culinaires
            </h1>

            <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-xl mx-auto px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 outline-none transition-all text-lg shadow-lg"
            />
          </div>
        </section>

        {/* GRID */}
        <section className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">

            {filteredDishes.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-black text-gray-900">
                    Aucun plat trouvé
                  </h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredDishes.map((dish) => (
                      <div
                          key={dish.id}
                          className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                      >
                        {/* IMAGE */}
                        <div className="relative w-full h-56">
                          <Image
                              src={getDishImage(dish.name)}
                              alt={dish.name}
                              fill
                              className="object-cover"
                          />
                        </div>

                        {/* CONTENT */}
                        <div className="p-6 flex flex-col flex-1">

                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-gray-900 text-lg">
                                {dish.name}
                              </h3>
                              <span className="text-[#FF6B35] font-black text-lg">
                          {dish.price.toFixed(2)}dt
                        </span>
                            </div>

                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {dish.description}
                            </p>
                          </div>

                          {/* BUTTON ALWAYS SAME LINE */}
                          <div className="mt-auto pt-6">
                            {user ? (
                                <Link
                                    href={`/client/menu?dish=${dish.id}`}
                                    className="w-full block text-center px-5 py-3 bg-[#FF6B35] text-white rounded-xl font-bold hover:bg-[#FF6B35]/90 transition-all"
                                >
                                  Commander
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full block text-center px-5 py-3 border-2 border-[#FF6B35] text-[#FF6B35] rounded-xl font-bold hover:bg-[#FF6B35]/5 transition-all"
                                >
                                  Se connecter
                                </Link>
                            )}
                          </div>

                        </div>
                      </div>
                  ))}
                </div>
            )}

          </div>
        </section>

        <Footer />
      </div>
  );
}
