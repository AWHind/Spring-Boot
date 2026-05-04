"use client";

import { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

import {
  DollarSign,
  ShoppingBag,
  Users,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Package,
  UserCheck,
  Sparkles,
  Crown,
  Target,
  Zap,
  Heart,
  Star,
  Gem,
  Shield,
  BarChart3,
  Activity,
  Wallet,
  CreditCard,
  ChefHat,
  Utensils,
  Pizza,
  Coffee,
  Wine,
  Gift,
  Percent,
  Truck,
  Bell,
} from "lucide-react";

type Stats = {
  orders: number;
  revenue: number;
  avgBasket: number;
  clients: number;
};

export default function Dashboard() {

  const [stats, setStats] = useState<Stats>({
    orders: 0,
    revenue: 0,
    avgBasket: 0,
    clients: 0
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<number[]>([]);
  const [categories, setCategories] = useState<number[]>([]);
  const [promoData, setPromoData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, o, r, c, p] = await Promise.all([
        fetch("http://localhost:8081/api/admin/stats"),
        fetch("http://localhost:8081/api/admin/latest-orders"),
        fetch("http://localhost:8081/api/admin/revenue"),
        fetch("http://localhost:8081/api/admin/categories"),
        fetch("http://localhost:8081/api/admin/promotions/stats")
      ]);

      setStats(await s.json());
      setOrders(await o.json());
      setRevenue(await r.json());
      setCategories(await c.json());
      setPromoData(await p.json());
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const safeRevenue = revenue.length ? revenue : [0, 0, 0, 0, 0, 0, 0];
  const safeCategories = categories.length ? categories : [0, 0, 0, 0];
  const safePromoData = promoData.length ? promoData : [0, 0, 0, 0, 0, 0, 0];

  const weekLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const monthLabels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];
  const yearLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

  const currentLabels = timeRange === "week" ? weekLabels : timeRange === "month" ? monthLabels : yearLabels;

  const revenueChart = {
    labels: currentLabels,
    datasets: [{
      label: "Chiffre d'affaires (DT)",
      data: safeRevenue,
      borderColor: "#f97316",
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(249,115,22,0.3)');
        gradient.addColorStop(1, 'rgba(249,115,22,0.02)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#f97316",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 2.5
    }]
  };

  const categoryChart = {
    labels: ["Pizzas", "Plats Principaux", "Boissons", "Desserts"],
    datasets: [{
      data: safeCategories,
      backgroundColor: ["#f97316", "#3b82f6", "#10b981", "#ec4899"],
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 12,
      borderRadius: 8,
      spacing: 2
    }]
  };

  const promoChart = {
    labels: currentLabels,
    datasets: [{
      label: "Utilisations des promotions",
      data: safePromoData,
      borderColor: "#10b981",
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(16,185,129,0.3)');
        gradient.addColorStop(1, 'rgba(16,185,129,0.02)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#10b981",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 2.5
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 15,
          font: { size: 11, weight: '500' as const, family: "'Inter', sans-serif" }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f97316',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 12,
        borderColor: '#f97316',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        grid: { color: '#f1f5f9', drawBorder: false },
        ticks: { callback: (value: any) => value + ' DT', font: { size: 11, family: "'Inter', sans-serif" } }
      },
      x: { grid: { display: false }, ticks: { font: { size: 11, family: "'Inter', sans-serif" } } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, boxWidth: 10, padding: 15, font: { size: 11, weight: '500' as const, family: "'Inter', sans-serif" } }
      },
      tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 12 }
    },
    cutout: '65%'
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-lg">Tableau de bord</p>
              <p className="text-gray-400 text-sm mt-1">Chargement des données...</p>
            </div>
          </div>
        </div>
    );
  }

  const totalOrdersValue = stats.orders;
  const revenueValue = stats.revenue;
  const clientsValue = stats.clients;
  const avgBasketValue = stats.avgBasket;

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">

          {/* HEADER PREMIUM */}
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Dashboard Analytics</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-full">Live</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Aperçu global
                  </h1>
                  <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                    <Activity size={14} className="text-gray-400" />
                    Analyse en temps réel des performances de votre restaurant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
                  <div className="flex gap-1">
                    {["week", "month", "year"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range as any)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                timeRange === range
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                          {range === "week" ? "Semaine" : range === "month" ? "Mois" : "Année"}
                        </button>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block text-right">
                  <p className="text-xs text-gray-400">Dernière mise à jour</p>
                  <p className="text-sm font-medium text-gray-600">{lastUpdate.toLocaleTimeString()}</p>
                </div>

                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:shadow-md transition-all duration-300"
                >
                  <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-sm font-medium">Actualiser</span>
                </button>
              </div>
            </div>
          </div>

          {/* STATS CARDS PREMIUM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <PremiumStatCard
                icon={<ShoppingBag size={20} />}
                title="Commandes"
                value={totalOrdersValue}
                trend={+12.5}
                color="orange"
            />
            <PremiumStatCard
                icon={<DollarSign size={20} />}
                title="Chiffre d'affaires"
                value={revenueValue}
                suffix=" DT"
                trend={+8.3}
                color="green"
            />
            <PremiumStatCard
                icon={<Users size={20} />}
                title="Clients"
                value={clientsValue}
                trend={+5.2}
                color="blue"
            />
            <PremiumStatCard
                icon={<Wallet size={20} />}
                title="Panier moyen"
                value={avgBasketValue}
                suffix=" DT"
                trend={+3.7}
                color="purple"
            />
          </div>

          {/* QUICK INSIGHTS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <InsightCard icon={<TrendingUp size={16} />} label="Croissance mensuelle" value="+18.5%" color="green" />
            <InsightCard icon={<Users size={16} />} label="Nouveaux clients" value="+42" color="blue" />
            <InsightCard icon={<Star size={16} />} label="Note moyenne" value="4.8/5" color="orange" />
            <InsightCard icon={<Percent size={16} />} label="Taux de fidélisation" value="67%" color="purple" />
          </div>

          {/* MAIN CHARTS */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <PremiumChartCard
                title="Évolution des revenus"
                subtitle="Tendance hebdomadaire"
                icon={<TrendingUp size={16} />}
                gradient="from-orange-500/10 to-orange-600/5"
            >
              <div className="h-[320px]">
                <Line data={revenueChart} options={chartOptions} />
              </div>
            </PremiumChartCard>

            <PremiumChartCard
                title="Répartition des ventes"
                subtitle="Par catégorie de produits"
                icon={<Pizza size={16} />}
                gradient="from-blue-500/10 to-indigo-500/5"
            >
              <div className="h-[320px] flex items-center justify-center">
                <Doughnut data={categoryChart} options={doughnutOptions} />
              </div>
            </PremiumChartCard>
          </div>

          {/* PROMOTIONS CHART */}
          <div className="mb-10">
            <PremiumChartCard
                title="Performance des promotions"
                subtitle="Utilisations des codes promo"
                icon={<Gift size={16} />}
                gradient="from-emerald-500/10 to-teal-500/5"
            >
              <div className="h-[300px]">
                <Line data={promoChart} options={chartOptions} />
              </div>
            </PremiumChartCard>
          </div>

          {/* RECENT ORDERS & TOP CLIENTS */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={18} className="text-orange-500" />
                      <h3 className="font-semibold text-gray-900">Commandes récentes</h3>
                    </div>
                    <p className="text-sm text-gray-400">Les dernières commandes en temps réel</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full absolute top-0 animate-pulse"></div>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package size={32} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400">Aucune commande récente</p>
                    </div>
                ) : (
                    orders.slice(0, 5).map((o, idx) => (
                        <div key={o.id} className="flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-transparent transition-all duration-300 group">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                                idx % 2 === 0 ? 'bg-orange-50 text-orange-500' : 'bg-gray-100 text-gray-500'
                            }`}>
                              <UserCheck size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{o.user?.name || "Client"}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Commande #{o.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-600">{o.total} DT</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {o.createdAt ? new Date(o.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "À l'instant"}
                            </p>
                          </div>
                        </div>
                    ))
                )}
              </div>

              {orders.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                    <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-semibold transition-all flex items-center justify-center gap-2 group">
                      Voir toutes les commandes
                      <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">

              {/* Top Client Card */}
              <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-yellow-400/20 rounded-xl">
                      <Crown size={16} className="text-yellow-300" />
                    </div>
                    <span className="font-semibold tracking-wide text-xs uppercase">Client Premium</span>
                  </div>
                  <p className="text-2xl font-bold">Sophie Martin</p>
                  <div className="flex justify-between mt-5 pt-4 border-t border-white/20">
                    <div>
                      <p className="text-white/60 text-xs">Commandes</p>
                      <p className="text-xl font-bold">12</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Dépensé</p>
                      <p className="text-xl font-bold">1,250 DT</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Points</p>
                      <p className="text-xl font-bold">2,450</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Seller Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-orange-50 rounded-lg">
                    <Star size={16} className="text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Plat le plus vendu</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
                      <Pizza size={22} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pizza Margherita</p>
                      <p className="text-xs text-gray-400">142 commandes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                      <TrendingUp size={12} />
                      +23%
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">vs mois dernier</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <Activity size={16} className="text-gray-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Activité récente</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 transition-all">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 flex-1">Nouvelle commande #1245</span>
                    <span className="text-gray-400 text-[10px]">2 min</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 transition-all">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600 flex-1">Avis 5 étoiles reçu</span>
                    <span className="text-gray-400 text-[10px]">15 min</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 transition-all">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 flex-1">Nouveau client inscrit</span>
                    <span className="text-gray-400 text-[10px]">1 heure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER PREMIUM */}
          <footer className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                <span>Dashboard Restaurant Analytics</span>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><Shield size={10} /> Sécurisé</span>
                <span>© 2024 Tous droits réservés</span>
                <span>Version 3.0.0</span>
              </div>
            </div>
          </footer>

        </div>
      </div>
  );
}

// ================= PREMIUM STAT CARD =================
function PremiumStatCard({ icon, title, value, suffix = "", trend, color }: any) {
  const isPositive = trend >= 0;
  const colors = {
    orange: { bg: "bg-orange-50", text: "text-orange-600", gradient: "from-orange-500/20 to-orange-600/10" },
    green: { bg: "bg-green-50", text: "text-green-600", gradient: "from-green-500/20 to-green-600/10" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", gradient: "from-blue-500/20 to-blue-600/10" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", gradient: "from-purple-500/20 to-purple-600/10" }
  };

  return (
      <div className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors[color].gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${colors[color].bg} group-hover:scale-110 transition-transform duration-300`}>
              <div className={colors[color].text}>{icon}</div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(trend)}%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full w-3/4 bg-gradient-to-r ${colors[color].text.replace('text-', 'bg-')} rounded-full`}></div>
            </div>
          </div>
        </div>
      </div>
  );
}

// ================= PREMIUM CHART CARD =================
function PremiumChartCard({ title, subtitle, icon, gradient, children }: any) {
  return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className={`p-6 border-b border-gray-100 bg-gradient-to-r ${gradient}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{subtitle}</p>
            </div>
            <div className="text-orange-500/30 text-xs">Analytics</div>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
  );
}

// ================= INSIGHT CARD =================
function InsightCard({ icon, label, value, color }: any) {
  const colors = {
    green: "bg-green-50 text-green-600 group-hover:bg-green-100",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100"
  };

  return (
      <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors[color]} transition-all duration-300 group-hover:scale-110`}>
            {icon}
          </div>
          <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
          </div>
        </div>
        <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
          <ArrowUpRight size={14} />
        </div>
      </div>
  );
}