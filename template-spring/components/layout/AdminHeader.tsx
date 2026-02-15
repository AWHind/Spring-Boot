'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin/dashboard" className="inline-flex items-center gap-3 font-bold hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-sm">
              ⚙️
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-foreground text-lg"> Admin</div>
              <div className="text-xs text-muted-foreground">Restaurant Management</div>
            </div>
          </Link>

          {/* Nav - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/admin/dashboard" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors hover:bg-accent/30 rounded-lg">
              Dashboard
            </Link>
            <Link href="/admin/orders" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors hover:bg-accent/30 rounded-lg">
              Commandes
            </Link>
            <Link href="/admin/menu" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors hover:bg-accent/30 rounded-lg">
              Menu
            </Link>
            <Link href="/admin/customers" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors hover:bg-accent/30 rounded-lg">
              Clients
            </Link>
            <Link href="/admin/promotions" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors hover:bg-accent/30 rounded-lg">
              Promotions
            </Link>
            <Link href="/admin/forecast" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors hover:bg-accent/30 rounded-lg">
              Prévisions
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{user?.name}</span>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20"
            >
              Déconnexion
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border space-y-1">
            <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent/30 rounded">
              Dashboard
            </Link>
            <Link href="/admin/orders" className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent/30 rounded">
              Commandes
            </Link>
            <Link href="/admin/menu" className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent/30 rounded">
              Menu
            </Link>
            <Link href="/admin/customers" className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent/30 rounded">
              Clients
            </Link>
            <Link href="/admin/promotions" className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent/30 rounded">
              Promotions
            </Link>
            <Link href="/admin/forecast" className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent/30 rounded">
              Prévisions
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
