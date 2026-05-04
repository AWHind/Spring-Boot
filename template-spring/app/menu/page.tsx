"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  Search, Star, Clock, Flame, Heart,
  TrendingUp, Filter, ArrowRight,
  ShoppingBag, ChefHat, Sparkles, Crown,
  Award, Zap, Shield, Truck, Coffee,
  Pizza, IceCream, Soup, UtensilsCrossed,
  Eye, Gift, Percent, BadgeCheck, Gem,
  Salad, Beef, Wine, Cake
} from 'lucide-react';

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  hasPromo?: boolean;
  discount?: number;
  finalPrice?: number;
  preparationTime?: number;
  rating?: number;
  isAvailable?: boolean;
  calories?: number;
  spicy?: boolean;
  vegetarian?: boolean;
};

/* NORMALIZE */
const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/* FALLBACK IMAGE */
const getDishImage = (name: string): string => {
  const lower = normalize(name);
  if (lower.includes("escargot")) return "/image/escargots.jpg";
  if (lower.includes("soupe")) return "/image/soupe-oignon.jpg";
  if (lower.includes("salade")) return "/image/salade-nicoise.jpg";
  if (lower.includes("foie")) return "/image/terrine-foie-gras.jpg";
  if (lower.includes("boeuf")) return "/image/dish-beef.jpg";
  if (lower.includes("magret")) return "/image/magret-canard.jpg";
  if (lower.includes("coq")) return "/image/coq-au-vin.jpg";
  if (lower.includes("vin rouge")) return "/image/vin-rouge.jpg";
  if (lower.includes("vin blanc")) return "/image/vin-blanc.jpg";
  if (lower.includes("pizza")) return "/image/dish-cheese.jpg";
  return "/image/default.jpg";
};

// Categories with icons and mapping to API categories
const categories = [
  { name: "Tous", icon: UtensilsCrossed, color: "gray", apiMatch: null },
  { name: "Entrées", icon: Soup, color: "emerald", apiMatch: ["entree", "entrées", "starter", "appetizer"] },
  { name: "Plats", icon: Pizza, color: "orange", apiMatch: ["plat", "plats", "main", "principal"] },
  { name: "Desserts", icon: IceCream, color: "pink", apiMatch: ["dessert", "desserts", "sweet"] },
  { name: "Boissons", icon: Coffee, color: "blue", apiMatch: ["boisson", "boissons", "drink", "beverage"] }
];

// Function to check if dish belongs to category
const isDishInCategory = (dish: Dish, categoryName: string): boolean => {
  if (categoryName === "Tous") return true;

  const category = categories.find(c => c.name === categoryName);
  if (!category || !category.apiMatch) return false;

  const dishCategory = dish.category?.toLowerCase().trim() || "";
  return category.apiMatch.some(match =>
      dishCategory === match ||
      dishCategory.includes(match) ||
      match.includes(dishCategory)
  );
};

export default function PublicMenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [hoveredDish, setHoveredDish] = useState<number | null>(null);
  const [likedDishes, setLikedDishes] = useState<number[]>([]);

  const { user } = useAuth();

  /* FETCH */
  useEffect(() => {
    fetch("http://localhost:8081/api/dishes")
        .then((res) => res.json())
        .then((data) => {
          const enrichedData = data.map((dish: Dish) => ({
            ...dish,
            preparationTime: dish.preparationTime || Math.floor(Math.random() * (30 - 15 + 1) + 15),
            rating: dish.rating || (3.5 + Math.random() * 1.5),
            isAvailable: dish.isAvailable !== false,
            calories: dish.calories || Math.floor(Math.random() * (800 - 200 + 1) + 200),
            spicy: Math.random() > 0.7,
            vegetarian: dish.category === "Entrées" ? Math.random() > 0.5 : false
          }));
          setDishes(enrichedData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
  }, []);

  /* FILTER - Connected to categories */
  const filteredDishes = useMemo(() => {
    let filtered = dishes.filter(dish => dish.isAvailable !== false);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(dish =>
          normalize(dish.name).includes(normalize(searchQuery)) ||
          normalize(dish.description).includes(normalize(searchQuery))
      );
    }

    // Category filter - USING THE MAPPING FUNCTION
    if (selectedCategory !== "Tous") {
      filtered = filtered.filter(dish => isDishInCategory(dish, selectedCategory));
    }

    return filtered;
  }, [searchQuery, dishes, selectedCategory]);

  // Get category counts for badges
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "Tous") return dishes.length;
    return dishes.filter(dish => isDishInCategory(dish, categoryName)).length;
  };

  const toggleLike = (dishId: number) => {
    setLikedDishes(prev =>
        prev.includes(dishId) ? prev.filter(id => id !== dishId) : [...prev, dishId]
    );
  };

  const resolveImage = (dish: Dish): string => {
    if (!dish.image || dish.image === "") return getDishImage(dish.name);
    if (dish.image.startsWith("/image")) return dish.image;
    return `/image/${dish.image}`;
  };

  const featuredDishes = dishes.filter(d => (d.rating || 0) > 4.2).slice(0, 4);
  const specialOffers = dishes.filter(d => d.hasPromo).slice(0, 3);

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-500 font-medium">Préparation de notre carte...</p>
            </div>
          </div>
          <Footer />
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />

        {/* ========== HERO SECTION ========== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full mb-8">
                <Flame size={18} className="text-yellow-300" />
                <span className="text-sm font-medium">CARTE CONNECTÉE</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
                Saveurs &
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> Authentiques</span>
              </h1>

              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
                Une expérience culinaire unique avec des ingrédients frais et authentiques
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                  <input
                      type="text"
                      placeholder="Rechercher un plat..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-5 py-5 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-2xl text-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
              <path fill="#f9fafb" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* ========== CATEGORIES WITH COUNTS ========== */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.name;
                const count = getCategoryCount(cat.name);
                const colors = {
                  gray: "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  emerald: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                  orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
                  pink: "bg-pink-50 text-pink-600 hover:bg-pink-100",
                  blue: "bg-blue-50 text-blue-600 hover:bg-blue-100"
                };

                return (
                    <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                            isActive
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                                : `${colors[cat.color as keyof typeof colors]}`
                        }`}
                    >
                      <Icon size={16} className={isActive ? "text-white" : ""} />
                      <span>{cat.name}</span>
                      {count > 0 && (
                          <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                              isActive ? "bg-white text-orange-600" : "bg-orange-500 text-white"
                          }`}>
                      {count}
                    </span>
                      )}

                      {/* Animation faza on hover */}
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                    </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========== SPECIAL OFFERS ========== */}
        {specialOffers.length > 0 && selectedCategory === "Tous" && !searchQuery && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Gift size={24} className="animate-bounce" />
                    <div>
                      <p className="font-bold">🎁 OFFRE SPÉCIALE</p>
                      <p className="text-sm opacity-90">Profitez de réductions exceptionnelles</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {specialOffers.map(dish => (
                        <span key={dish.id} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    -{dish.discount}% sur {dish.name}
                  </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* ========== MAIN CONTENT ========== */}
        <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">

            {/* Featured Section - Only when no filter */}
            {!searchQuery && selectedCategory === "Tous" && dishes.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Recommandés</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Crown size={24} className="text-yellow-500" />
                        Les plus populaires
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredDishes.map((dish, idx) => (
                        <div key={dish.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                          <div className="relative h-48 overflow-hidden">
                            <Image
                                src={resolveImage(dish)}
                                alt={dish.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                              <Star size={10} fill="currentColor" />
                              {dish.rating?.toFixed(1)}
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-gray-800 text-lg">{dish.name}</h3>
                            <p className="text-orange-500 font-bold text-xl mt-2">{dish.price.toFixed(2)} DT</p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                            <Link
                                href={user ? `/client/order?dish=${dish.id}` : "/login"}
                                className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105"
                            >
                              Commander
                            </Link>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <UtensilsCrossed size={14} className="text-orange-500" />
                </div>
                <p className="text-gray-500">
                  <span className="font-bold text-gray-800 text-lg">{filteredDishes.length}</span> plats trouvés
                </p>
                {selectedCategory !== "Tous" && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                  {selectedCategory}
                </span>
                )}
              </div>
            </div>

            {/* Dishes Grid with Food Animation */}
            {filteredDishes.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={36} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun plat trouvé</h3>
                  <p className="text-gray-500">Essayez de modifier votre recherche</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                  {filteredDishes.map((dish, idx) => {
                    const isHovered = hoveredDish === dish.id;
                    const finalPrice = dish.finalPrice || dish.price;
                    const hasDiscount = dish.hasPromo || (dish.discount && dish.discount > 0);
                    const isLiked = likedDishes.includes(dish.id);
                    const categoryIcon = categories.find(c => isDishInCategory(dish, c.name))?.icon || UtensilsCrossed;
                    const CategoryIcon = categoryIcon;

                    return (
                        <div
                            key={dish.id}
                            onMouseEnter={() => setHoveredDish(dish.id)}
                            onMouseLeave={() => setHoveredDish(null)}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          {/* Food Flying Animation on Hover */}
                          <div className={`absolute -top-10 -left-10 text-4xl transform transition-all duration-700 z-10 pointer-events-none ${
                              isHovered ? 'translate-x-16 translate-y-20 rotate-12 scale-110 opacity-100' : 'opacity-0'
                          }`}>
                            🍽️
                          </div>
                          <div className={`absolute -bottom-10 -right-10 text-4xl transform transition-all duration-700 delay-100 z-10 pointer-events-none ${
                              isHovered ? '-translate-x-16 -translate-y-20 -rotate-12 scale-110 opacity-100' : 'opacity-0'
                          }`}>
                            🍜
                          </div>
                          <div className={`absolute top-1/2 left-1/2 text-3xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10 pointer-events-none ${
                              isHovered ? 'scale-150 opacity-20' : 'scale-50 opacity-0'
                          }`}>
                            🍕
                          </div>

                          {/* Image Container */}
                          <div className="relative h-56 overflow-hidden bg-gray-100">
                            <Image
                                src={resolveImage(dish)}
                                alt={dish.name}
                                fill
                                className={`object-cover transition-all duration-700 ${
                                    isHovered ? 'scale-110 blur-[2px]' : 'scale-100'
                                }`}
                            />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2 z-20">
                              {hasDiscount && (
                                  <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg transform -rotate-3">
                            -{dish.discount}%
                          </span>
                              )}
                              <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 z-20">
                          <CategoryIcon size={10} />
                                {dish.category}
                        </span>
                            </div>

                            {dish.rating && dish.rating > 4 && (
                                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg z-20">
                                  <Star size={10} fill="currentColor" />
                                  {dish.rating.toFixed(1)}
                                </div>
                            )}

                            {/* Like Button */}
                            <button
                                onClick={() => toggleLike(dish.id)}
                                className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all transform hover:scale-110 z-20 ${
                                    isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500 hover:text-red-500'
                                }`}
                            >
                              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                            </button>

                            {/* Quick View Overlay with Food Animation */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center transition-all duration-500 z-10 ${
                                isHovered ? 'opacity-100' : 'opacity-0'
                            }`}>
                              <div className="transform transition-all duration-500">
                                <Link
                                    href={user ? `/client/order?dish=${dish.id}` : "/login"}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105"
                                >
                                  <ShoppingBag size={16} />
                                  Commander
                                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                            </div>

                            {/* Food particles on hover */}
                            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                                isHovered ? 'opacity-100' : 'opacity-0'
                            }`}>
                              <div className="absolute top-1/4 left-1/4 text-xl animate-bounce">🍅</div>
                              <div className="absolute top-1/3 right-1/4 text-xl animate-bounce delay-100">🥬</div>
                              <div className="absolute bottom-1/3 left-1/3 text-xl animate-bounce delay-200">🧀</div>
                              <div className="absolute bottom-1/4 right-1/3 text-xl animate-bounce delay-300">🍄</div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex flex-col flex-1 relative z-20 bg-white">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`font-bold text-lg text-gray-800 line-clamp-1 transition-colors duration-300 ${
                                  isHovered ? 'text-orange-600' : ''
                              }`}>
                                {dish.name}
                              </h3>
                              <div className="text-right">
                                {hasDiscount ? (
                                    <>
                              <span className="text-xs text-gray-400 line-through block">
                                {dish.price.toFixed(2)} DT
                              </span>
                                      <span className="text-orange-600 font-bold text-xl">
                                {finalPrice.toFixed(2)} DT
                              </span>
                                    </>
                                ) : (
                                    <span className={`text-orange-600 font-bold text-xl transition-all duration-300 ${
                                        isHovered ? 'scale-110 inline-block' : ''
                                    }`}>
                              {dish.price.toFixed(2)} DT
                            </span>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                              {dish.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <div className="flex items-center gap-2">
                                <Clock size={12} />
                                <span>{dish.preparationTime} min</span>
                              </div>
                              {dish.spicy && (
                                  <div className="flex items-center gap-1">
                                    <Flame size={12} className="text-red-500" />
                                    <span>Épicé</span>
                                  </div>
                              )}
                            </div>
                          </div>

                          {/* Animated border on hover */}
                          <div className={`absolute inset-0 border-2 border-orange-400 rounded-2xl transition-all duration-500 pointer-events-none ${
                              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                          }`}></div>
                        </div>
                    );
                  })}
                </div>
            )}
          </div>
        </section>

        <Footer />

        <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
      </div>
  );
}