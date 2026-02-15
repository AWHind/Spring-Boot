'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useOrders } from '@/lib/contexts/OrderContext';
import { OrderStatus } from '@/lib/types';
import { mockCustomers } from '@/lib/mock-data';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders } = useOrders();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const validatedOrders = orders.filter(o => o.status !== OrderStatus.CANCELLED).length;
    const cancelledOrders = orders.filter(o => o.status === OrderStatus.CANCELLED).length;
    const averageOrderValue = validatedOrders > 0 ? totalRevenue / validatedOrders : 0;

    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => o.createdAt.toDateString() === today);
    const ordersToday = todayOrders.length;
    const revenueToday = todayOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      totalCustomers: mockCustomers.length,
      ordersToday,
      revenueToday,
      validatedOrders,
      cancelledOrders
    };
  }, [orders]);

  // Mock revenue trend data
  const revenueTrend = [
    { day: 'Lun', value: 1250 },
    { day: 'Mar', value: 1890 },
    { day: 'Mer', value: 2890 },
    { day: 'Jeu', value: 2100 },
    { day: 'Ven', value: 2450 },
    { day: 'Sam', value:  1620},
    { day: 'Dim', value: 1980 }
  ];

  const ordersByStatus = [
    { status: 'Pending', value: orders.filter(o => o.status === OrderStatus.PENDING).length },
    { status: 'Validated', value: orders.filter(o => o.status === OrderStatus.VALIDATED).length },
    { status: 'Delivered', value: orders.filter(o => o.status === OrderStatus.DELIVERED).length },
    { status: 'Cancelled', value: orders.filter(o => o.status === OrderStatus.CANCELLED).length }
  ];

  const statusBarClass: Record<string, string> = {
    Pending: 'bg-yellow-500',
    Validated: 'bg-blue-500',
    Delivered: 'bg-green-500',
    Cancelled: 'bg-red-500'
  };

  const bestDay = revenueTrend.reduce((best, cur) => (cur.value > best.value ? cur : best), revenueTrend[0]);

  if (!isClient || !user || user.role !== 'admin') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin">Loading...</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col bg-background">
        <AdminHeader />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
          {/* HERO HEADER - Premium */}
          <div className="mb-20 space-y-4 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>

            <div className="flex items-center gap-3">
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest">
                Tableau Analytique
              </p>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent">
              Tableau de Bord Administrateur
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl">
              Bienvenue, <span className="font-semibold text-foreground">{user?.name}</span>. Analyse complète des performances en temps réel.
            </p>
          </div>

          {/* Key Metrics - Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-7 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-secondary/15 rounded-xl group-hover:bg-secondary/25 transition-colors">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2 9m-12 0h12" />
                  </svg>
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">Commandes</p>
              <p className="text-5xl font-black text-foreground">{stats.totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-3">Total</p>
            </div>

            <div className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-7 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-primary/15 rounded-xl group-hover:bg-primary/25 transition-colors">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-2c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm-1 11h2v2h-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">Revenus</p>
              <p className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stats.totalRevenue.toFixed(0)}<span className="text-2xl">dt</span>
              </p>
              <p className="text-xs text-muted-foreground mt-3">Total</p>
            </div>

            <div className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-7 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-accent/15 rounded-xl group-hover:bg-accent/25 transition-colors">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">Panier Moyen</p>
              <p className="text-5xl font-black text-foreground">
                {stats.averageOrderValue.toFixed(2)}<span className="text-2xl">dt</span>
              </p>
              <p className="text-xs text-muted-foreground mt-3">Moyenne</p>
            </div>

            <div className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-7 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-secondary/15 rounded-xl group-hover:bg-secondary/25 transition-colors">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">Clients</p>
              <p className="text-5xl font-black text-foreground">{stats.totalCustomers}</p>
              <p className="text-xs text-muted-foreground mt-3">Actifs</p>
            </div>
          </div>

          {/* Today's Stats + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-foreground">Statistiques du jour</h2>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Aujourd’hui
              </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-accent/5 rounded-xl">
                  <span className="text-muted-foreground font-medium">Commandes</span>
                  <span className="text-3xl font-black text-foreground">{stats.ordersToday}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl">
                  <span className="text-muted-foreground font-medium">Revenu</span>
                  <span className="text-3xl font-black text-primary">{stats.revenueToday.toFixed(2)}dt</span>
                </div>
              </div>
            </div>

            <div className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-foreground">Résumé des statuts</h2>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Répartition
              </span>
              </div>

              <div className="space-y-4">
                {ordersByStatus.map(item => (
                    <div key={item.status} className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-muted-foreground">{item.status}</span>

                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                              className={`${statusBarClass[item.status]} h-2 rounded-full transition-all`}
                              style={{
                                width: `${stats.totalOrders > 0 ? (item.value / stats.totalOrders) * 100 : 0}%`
                              }}
                          />
                        </div>

                        <span className="font-black text-foreground min-w-[2rem] text-right">
                      {item.value}
                    </span>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Trend Chart - NEW THEME + IMPROVED */}
          <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 mb-12 hover:shadow-xl transition-all">
            {/* Decorative gradient */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>

            <div className="relative flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-foreground">
                  Évolution du chiffre d’affaires
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Aperçu hebdomadaire • Meilleur jour : <span className="font-semibold text-foreground">{bestDay.day}</span> ({bestDay.value} dt)
                </p>
              </div>

              <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                7 jours
              </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">
                Temps réel
              </span>
              </div>
            </div>

            <div className="relative w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value) => [`${value} dt`, 'Chiffre d’affaires']}
                  />
                  <Legend />
                  <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={4}
                      dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                      activeDot={{ r: 9 }}
                      name="Chiffre d’affaires"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
                href="/admin/orders"
                className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2 9m-12 0h12" />
                  </svg>
                </div>
                <h3 className="font-black text-foreground group-hover:text-primary transition-colors">
                  Gérer les commandes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">Voir et valider les commandes en attente</p>
            </a>

            <a
                href="/admin/menu"
                className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                <h3 className="font-black text-foreground group-hover:text-primary transition-colors">
                  Menu
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">Ajouter, modifier ou supprimer des plats</p>
            </a>

            <a
                href="/admin/customers"
                className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                  </svg>
                </div>
                <h3 className="font-black text-foreground group-hover:text-primary transition-colors">
                  Clients
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">Gérer les clients et offres spéciales</p>
            </a>
          </div>
        </main>

        <Footer />
      </div>
  );
}
