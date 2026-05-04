"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
    Trash2, Plus, Minus, ShoppingBag, MapPin,
    MessageSquare, CreditCard, Truck, Clock,
    ArrowRight, AlertCircle, ChevronLeft
} from "lucide-react";

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart } = useCart();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
    const [deliveryFee] = useState(3.5);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

    // Calculate totals
    const subtotal = items.reduce(
        (sum, i) => sum + ((i?.dish?.price || 0) * (i?.quantity || 0)),
        0
    );
    const total = subtotal + deliveryFee - discount;

    // Fetch saved addresses
    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:8081/api/users/${user.id}/addresses`)
                .then(res => res.json())
                .then(data => setSavedAddresses(data.addresses || []))
                .catch(() => {});
        }
    }, [user]);

    // Handle order submission
    const handleOrder = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user") || "null");

            if (!userData) {
                alert("Veuillez vous connecter d'abord");
                router.push("/login");
                return;
            }

            if (items.length === 0) {
                alert("Votre panier est vide");
                return;
            }

            if (!address.trim()) {
                alert("Veuillez entrer votre adresse");
                return;
            }

            setLoading(true);

            const res = await fetch("http://localhost:8081/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    userId: userData.id,
                    items: items.map(item => ({
                        dishId: item.dish.id,
                        name: item.dish.name,
                        price: item.dish.price,
                        quantity: item.quantity
                    })),
                    total: total,
                    subtotal: subtotal,
                    deliveryFee: deliveryFee,
                    discount: discount,
                    address: address,
                    notes: notes,
                    status: "pending"
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur API");
            }

            alert("✅ Commande confirmée avec succès !");
            clearCart();
            router.push("/client/orders");

        } catch (e) {
            console.error(e);
            alert("❌ Erreur lors de la commande. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    // Apply promo code
    const applyPromoCode = () => {
        if (promoCode === "WELCOME10") {
            setDiscount(subtotal * 0.1);
            alert("Code promo appliqué: -10%");
        } else if (promoCode === "FREESHIP") {
            setDiscount(deliveryFee);
            alert("Livraison offerte !");
        } else {
            alert("Code promo invalide");
        }
        setPromoCode("");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                            Mon Panier
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {items.length} {items.length === 1 ? 'article' : 'articles'}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/client/menu")}
                        className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold"
                    >
                        <ArrowRight size={18} />
                        Continuer mes achats
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT - Cart Items */}
                    <div className="lg:col-span-2 space-y-6">

                        {items.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Votre panier est vide
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Ajoutez des plats depuis le menu
                                </p>
                                <button
                                    onClick={() => router.push("/client/menu")}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                                >
                                    Découvrir le menu
                                </button>
                            </div>
                        ) : (
                            items
                                .filter(i => i && i.dish)
                                .map((item) => (
                                    <div
                                        key={item.dish.id}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
                                    >
                                        <div className="flex gap-5">
                                            {/* Image */}
                                            <img
                                                src={item.dish?.image || "/images/default-dish.jpg"}
                                                alt={item.dish?.name}
                                                className="w-24 h-24 rounded-xl object-cover"
                                            />

                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-lg">
                                                            {item.dish?.name || "Produit"}
                                                        </h3>
                                                        <p className="text-gray-500 text-sm mt-1">
                                                            {item.dish?.description?.substring(0, 60)}...
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.dish.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-center mt-4">
                                                    <span className="text-orange-500 font-bold text-xl">
                                                        {(item.dish?.price || 0).toFixed(2)} DT
                                                    </span>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.dish.id, Math.max(1, item.quantity - 1))}
                                                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-semibold w-8 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                                                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>

                    {/* RIGHT - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">

                            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <ShoppingBag size={20} className="text-orange-500" />
                                Récapitulatif
                            </h2>

                            {/* Totals */}
                            <div className="space-y-3 pb-4 border-b border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Sous-total</span>
                                    <span>{subtotal.toFixed(2)} DT</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Truck size={14} />
                                        <span>Livraison</span>
                                    </div>
                                    <span>{deliveryFee.toFixed(2)} DT</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Réduction</span>
                                        <span>-{discount.toFixed(2)} DT</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between pt-4 mb-6">
                                <span className="font-bold text-gray-800 text-lg">Total</span>
                                <span className="text-2xl font-bold text-orange-500">
                                    {total.toFixed(2)} DT
                                </span>
                            </div>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Code promo
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Entrez votre code"
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Appliquer
                                    </button>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin size={14} />
                                    Adresse de livraison
                                </label>

                                {savedAddresses.length > 0 && (
                                    <div className="mb-3 space-y-2">
                                        {savedAddresses.map((addr, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setAddress(addr)}
                                                className="w-full text-left p-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                                            >
                                                {addr}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Votre adresse complète..."
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Notes */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MessageSquare size={14} />
                                    Instructions spéciales
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ex: Sans oignons, livrer à l'entrée principale..."
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Delivery Info */}
                            <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3 mb-6">
                                <Clock size={16} className="text-orange-500" />
                                <div>
                                    <p className="text-xs font-medium text-orange-800">
                                        Livraison estimée
                                    </p>
                                    <p className="text-xs text-orange-600">
                                        30-45 minutes après validation
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <button
                                onClick={handleOrder}
                                disabled={loading || items.length === 0}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Traitement...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={18} />
                                        <span>Confirmer la commande</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => clearCart()}
                                className="w-full mt-3 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                            >
                                Vider le panier
                            </button>

                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}