'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/contexts/CartContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - RoastLux Style */}
          <Link href={user ? '/client/menu' : '/'} className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="font-bold text-gray-900 text-xl tracking-tight">Maison Élysia</div>
          </Link>

          {/* Nav Links - Desktop - RoastLux Style */}
          <nav className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link href="/client/menu" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Menu
                </Link>
                <Link href="/client/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Commandes
                </Link>
                <Link href="/client/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Profil
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="text-sm font-medium px-3 py-1 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF6B35]/90">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Accueil
                </Link>
                <Link href="/menu" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Menu
                </Link>

              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Cart Icon */}
                <Link href="/client/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2 9m-12 0h12M9 6h6m0 0h3m-3 0h-3" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    {user.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {user.role === 'client' && (
                      <>
                        <Link href="/client/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-accent rounded-t-lg">
                          Profil
                        </Link>
                        <Link href="/client/orders" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
                          Commandes
                        </Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <>
                        <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-accent rounded-t-lg">
                          Dashboard
                        </Link>
                        <Link href="/admin/orders" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
                          Commandes
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = '/';
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent rounded-b-lg"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
                  Connexion
                </Link>
                <Link href="/register" className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#FF6B35]/90 transition-all hover:shadow-lg">
                  S&apos;inscrire
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            {user ? (
              <>
                <Link href="/client/menu" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  Menu
                </Link>
                <Link href="/client/orders" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  Commandes
                </Link>
                <Link href="/client/profile" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  Profil
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-[#FF6B35] font-medium">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  Accueil
                </Link>
                <Link href="/menu" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  Menu
                </Link>
                <a href="#about" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  À propos
                </a>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
