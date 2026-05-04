"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";
import {
    Search, ShoppingBag, Star, Clock,
    ChefHat, Flame, Heart, Eye,
    Filter, ArrowRight, TrendingUp,
    Soup, Pizza, IceCream, Coffee, Utensils
} from "lucide-react";

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
};

const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const resolveImage = (dish: Dish): string => {
    if (!dish.image) return "/image/default.jpg";
    if (dish.image.startsWith("/image")) return dish.image;
    return `/image/${dish.image}`;
};

// Category configuration with API mapping
const categories = [
    {
        name: "Entrées",
        icon: Soup,
        value: "entrees",
        apiCategories: ["entree", "entrées", "starter", "appetizer", "apéritif"]
    },
    {
        name: "Plats",
        icon: Pizza,
        value: "plats",
        apiCategories: ["plat", "plats", "main", "main course", "principal"]
    },
    {
        name: "Desserts",
        icon: IceCream,
        value: "desserts",
        apiCategories: ["dessert", "desserts", "sweet", "douceur"]
    },
    {
        name: "Boissons",
        icon: Coffee,
        value: "boissons",
        apiCategories: ["boisson", "boissons", "drink", "beverage", "soft", "jus"]
    }
];

export default function PublicMenuPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [hoveredDish, setHoveredDish] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [sortBy, setSortBy] = useState<string>("default");

    const { user } = useAuth();
    const { addItem, items } = useCart();

    // Fetch dishes from API
    useEffect(() => {
        fetch("http://localhost:8081/api/dishes")
            .then((res) => res.json())
            .then((data) => {
                const enrichedData = data.map((dish: Dish) => ({
                    ...dish,
                    preparationTime: dish.preparationTime || Math.floor(Math.random() * (30 - 15 + 1) + 15),
                    rating: dish.rating || (3.5 + Math.random() * 1.5),
                    isAvailable: dish.isAvailable !== false,
                    category: dish.category?.toLowerCase().trim() || "plats"
                }));
                setDishes(enrichedData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Function to check if dish belongs to a category
    const isDishInCategory = (dish: Dish, category: typeof categories[0]): boolean => {
        const dishCategory = dish.category?.toLowerCase().trim();

        // Direct match
        if (dishCategory === category.value) return true;

        // Check against API categories
        return category.apiCategories.some(apiCat =>
            dishCategory === apiCat ||
            dishCategory?.includes(apiCat) ||
            apiCat.includes(dishCategory || "")
        );
    };

    // Filter dishes based on search, category, price, and sort
    const filteredDishes = useMemo(() => {
        let filtered = dishes.filter((dish) => dish.isAvailable !== false);

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (dish) =>
                    normalize(dish.name).includes(normalize(searchQuery)) ||
                    normalize(dish.description).includes(normalize(searchQuery))
            );
        }

        // Category filter - using the mapping function
        if (selectedCategory) {
            const selectedCatObj = categories.find(c => c.value === selectedCategory);
            if (selectedCatObj) {
                filtered = filtered.filter(dish => isDishInCategory(dish, selectedCatObj));
            }
        }

        // Price filter
        filtered = filtered.filter(dish =>
            (dish.finalPrice || dish.price) >= priceRange[0] &&
            (dish.finalPrice || dish.price) <= priceRange[1]
        );

        // Sort
        if (sortBy === "price_asc") {
            filtered.sort((a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price));
        } else if (sortBy === "price_desc") {
            filtered.sort((a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price));
        } else if (sortBy === "rating") {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
    }, [searchQuery, dishes, selectedCategory, priceRange, sortBy]);

    // Get counts for each category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        categories.forEach(cat => {
            counts[cat.value] = dishes.filter(dish =>
                isDishInCategory(dish, cat) && dish.isAvailable !== false
            ).length;
        });
        return counts;
    }, [dishes]);

    // Get featured dishes (high rating)
    const featuredDishes = dishes
        .filter(d => (d.rating || 0) > 4.2 && d.isAvailable !== false)
        .slice(0, 4);

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setPriceRange([0, 100]);
        setSortBy("default");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-20 right-10 opacity-10">
                    <ChefHat size={200} className="text-white" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="text-center text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Flame size={16} />
                            <span className="text-sm font-medium">Découvrez notre carte</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Art & Saveurs
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                            Une expérience culinaire unique avec des ingrédients frais et authentiques
                        </p>

                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher un plat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
                        <path fill="#f3f4f6" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </section>

            {/* Categories Filter - Connected to API */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-400" />
                                <span className="text-sm text-gray-500">Catégories:</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        selectedCategory === null
                                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/25"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    <Utensils size={16} />
                                    <span>Tous</span>
                                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                                        {dishes.length}
                                    </span>
                                </button>

                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    const count = categoryCounts[cat.value];
                                    const isActive = selectedCategory === cat.value;

                                    return (
                                        <button
                                            key={cat.value}
                                            onClick={() => setSelectedCategory(cat.value)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                isActive
                                                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/25"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                        >
                                            <Icon size={16} />
                                            <span>{cat.name}</span>
                                            {count > 0 && !isActive && (
                                                <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="default">Trier par</option>
                                    <option value="price_asc">Prix croissant</option>
                                    <option value="price_desc">Prix décroissant</option>
                                    <option value="rating">Meilleures notes</option>
                                    <option value="name">Nom A-Z</option>
                                </select>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100"
                                >
                                    <Filter size={14} />
                                    Prix
                                </button>
                            </div>
                        </div>

                        {/* Price Range Slider */}
                        {showFilters && (
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="text-sm text-gray-500">Filtrer par prix max:</span>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            {priceRange[1]} DT
                                        </span>
                                        <button
                                            onClick={() => setPriceRange([0, 100])}
                                            className="text-xs text-orange-500 hover:text-orange-600"
                                        >
                                            Réinitialiser
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Active Filters Display */}
                    {(selectedCategory || searchQuery || priceRange[1] < 100 || sortBy !== "default") && (
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-500">Filtres actifs:</span>
                            {selectedCategory && (
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
                                    {categories.find(c => c.value === selectedCategory)?.name}
                                    <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-orange-900">×</button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                                    "{searchQuery}"
                                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-blue-900">×</button>
                                </span>
                            )}
                            {priceRange[1] < 100 && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                                    Max {priceRange[1]} DT
                                    <button onClick={() => setPriceRange([0, 100])} className="ml-1 hover:text-green-900">×</button>
                                </span>
                            )}
                            <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-gray-600">
                                Tout effacer
                            </button>
                        </div>
                    )}

                    {/* Featured Section - Only when no category selected and no search */}
                    {!selectedCategory && !searchQuery && !loading && dishes.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">⭐ Les plus populaires</h2>
                                    <p className="text-gray-500 text-sm">Nos clients les adorent</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredDishes.map((dish) => (
                                    <div key={dish.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                        <div className="relative h-40">
                                            <Image
                                                src={resolveImage(dish)}
                                                alt={dish.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                <Star size={10} fill="currentColor" />
                                                {dish.rating?.toFixed(1)}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-800">{dish.name}</h3>
                                            <p className="text-orange-500 font-bold mt-1">{dish.price.toFixed(2)} DT</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                        <div className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredDishes.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun plat trouvé</h3>
                            <p className="text-gray-500">Essayez une autre recherche ou catégorie</p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-gray-500">
                                    <span className="font-semibold text-gray-700">{filteredDishes.length}</span> {filteredDishes.length === 1 ? 'plat disponible' : 'plats disponibles'}
                                </p>
                                {selectedCategory && (
                                    <div className="flex items-center gap-2 text-sm text-orange-500">
                                        <span>{categories.find(c => c.value === selectedCategory)?.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Dishes Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredDishes.map((dish) => {
                                    const isHovered = hoveredDish === dish.id;
                                    const finalPrice = dish.finalPrice || dish.price;
                                    const hasDiscount = dish.hasPromo || (dish.discount && dish.discount > 0);
                                    const categoryInfo = categories.find(c => isDishInCategory(dish, c));
                                    const CategoryIcon = categoryInfo?.icon || Utensils;

                                    return (
                                        <div
                                            key={dish.id}
                                            onMouseEnter={() => setHoveredDish(dish.id)}
                                            onMouseLeave={() => setHoveredDish(null)}
                                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="relative h-52 overflow-hidden bg-gray-100">
                                                <Image
                                                    src={resolveImage(dish)}
                                                    alt={dish.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />

                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    {hasDiscount && (
                                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                            -{dish.discount}%
                                                        </span>
                                                    )}
                                                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                                        <CategoryIcon size={10} />
                                                        {categoryInfo?.name || dish.category}
                                                    </span>
                                                </div>

                                                {dish.rating && dish.rating > 4 && (
                                                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Star size={10} fill="currentColor" />
                                                        {dish.rating.toFixed(1)}
                                                    </div>
                                                )}

                                                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                                                    isHovered ? "opacity-100" : "opacity-0"
                                                }`}>
                                                    <button className="p-2 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                                                        <Heart size={18} />
                                                    </button>
                                                    <button className="p-2 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                                                        {dish.name}
                                                    </h3>
                                                    <div className="text-right">
                                                        {hasDiscount ? (
                                                            <>
                                                                <span className="text-xs text-gray-400 line-through block">
                                                                    {dish.price.toFixed(2)} DT
                                                                </span>
                                                                <span className="text-orange-500 font-bold">
                                                                    {finalPrice.toFixed(2)} DT
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-orange-500 font-bold">
                                                                {dish.price.toFixed(2)} DT
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                    {dish.description}
                                                </p>

                                                {dish.preparationTime && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                                                        <Clock size={12} />
                                                        <span>{dish.preparationTime} min</span>
                                                    </div>
                                                )}

                                                {user ? (
                                                    <button
                                                        onClick={() => addItem(dish, 1)}
                                                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <ShoppingBag size={16} />
                                                        Ajouter
                                                    </button>
                                                ) : (
                                                    <Link
                                                        href="/login"
                                                        className="w-full py-2.5 border-2 border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        Se connecter
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Floating Cart Button */}
            {items.length > 0 && (
                <Link
                    href="/client/cart"
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 z-50 group"
                >
                    <div className="relative">
                        <ShoppingBag size={20} />
                        <span className="absolute -top-2 -right-2 bg-white text-orange-500 rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center">
                            {items.length}
                        </span>
                    </div>
                    <span className="font-semibold">Mon panier</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            )}

            <Footer />
        </div>
    );
}