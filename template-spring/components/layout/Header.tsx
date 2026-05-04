"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAdmin = user?.role?.toUpperCase().includes("ADMIN");

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
      <header
          className={`sticky top-0 z-50 border-b ${
              isAdmin
                  ? "bg-white/95 backdrop-blur border-gray-200 shadow-sm"
                  : "bg-black/80 backdrop-blur-2xl border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <Link href="/">
              <div className={`font-bold text-xl ${isAdmin ? "text-gray-900" : "text-white"}`}>
                ⚡ Maison Élysia
              </div>
            </Link>

            {/* NAV */}
            <nav className="hidden md:flex items-center gap-10 text-sm">
              {user && !isAdmin && (
                  <>
                    <Link href="/client/menu" className="text-gray-400 hover:text-white">Menu</Link>
                    <Link href="/client/orders" className="text-gray-400 hover:text-white">Commandes</Link>
                    <Link href="/client/profile" className="text-gray-400 hover:text-white">Profil</Link>
                  </>
              )}
            </nav>

            {/* RIGHT */}
            <div className="flex items-center gap-5 relative">

              {/* CART */}
              {user && !isAdmin && (
                  <Link href="/client/cart" className="relative text-white text-lg">
                    🛒
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 rounded-full">
                    {cartCount}
                  </span>
                    )}
                  </Link>
              )}

              {/* USER MENU */}
              {user ? (
                  <div className="relative">

                    {/* BUTTON */}
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 text-white hover:opacity-80"
                    >
                      👤 {user.name}

                      {/* 🏆 CARTE */}
                      {user.carte && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-400/20 text-yellow-400">
                      {user.carte.type}
                    </span>
                      )}
                    </button>

                    {/* DROPDOWN */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-black border border-white/10 rounded-xl shadow-lg overflow-hidden animate-fadeIn">

                          <Link
                              href="/client/profile"
                              className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                          >
                            👤 Mon profil
                          </Link>

                          <Link
                              href="/client/cart"
                              className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                          >
                            🛒 Mon panier
                          </Link>

                          <div className="border-t border-white/10"></div>

                          <button
                              onClick={() => {
                                logout();
                                window.location.href = "/";
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                          >
                            🚪 Déconnexion
                          </button>

                        </div>
                    )}

                  </div>
              ) : (
                  <>
                    <Link href="/login" className="text-white">Connexion</Link>
                    <Link href="/register" className="bg-orange-500 px-4 py-1.5 rounded-lg text-white">
                      S'inscrire
                    </Link>
                  </>
              )}

              {/* MOBILE */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                ☰
              </button>

            </div>
          </div>
        </div>
      </header>
  );
};