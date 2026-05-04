"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Award,
  Crown,
  Medal,
  Mail,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Activity,
  Eye,
  Sparkles,
  Gem,
  Shield,
  Target,
  Zap,
  Star,
  Trophy,
  Wallet,
  Package,
  UserCheck,
  BarChart3,
  Clock,
  Heart,
  Gift,
  Coffee,
  Star as StarIcon
} from "lucide-react";

// Configuration des tiers basée sur le montant dépensé
const getTierFromSpent = (totalSpent: number): "bronze" | "silver" | "gold" => {
  if (totalSpent >= 500) return "gold";
  if (totalSpent >= 200) return "silver";
  return "bronze";
};

type Customer = {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyTier: "bronze" | "silver" | "gold";
};

const tierConfig: any = {
  gold: {
    label: "Gold",
    name: "Or",
    icon: Crown,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    gradient: "from-amber-400 to-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
    shadow: "shadow-amber-200/50",
    badgeGradient: "from-amber-500 to-amber-700",
    threshold: "500+ DT",
    description: "Clients VIP",
    perks: ["Livraison gratuite", "10% de réduction", "Cadeau exclusif"]
  },
  silver: {
    label: "Silver",
    name: "Argent",
    icon: Medal,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    gradient: "from-slate-400 to-slate-600",
    bgGradient: "from-slate-50 to-slate-100/50",
    shadow: "shadow-slate-200/50",
    badgeGradient: "from-slate-500 to-slate-700",
    threshold: "200 - 500 DT",
    description: "Clients fidèles",
    perks: ["Livraison gratuite", "5% de réduction"]
  },
  bronze: {
    label: "Bronze",
    name: "Bronze",
    icon: Award,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    gradient: "from-amber-400 to-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
    shadow: "shadow-amber-200/50",
    badgeGradient: "from-amber-500 to-amber-700",
    threshold: "0 - 200 DT",
    description: "Nouveaux clients",
    perks: ["Bienvenue offert"]
  }
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "totalSpent" | "totalOrders">("totalSpent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Authentification
  useEffect(() => {
    if (isReady && (!user || user.role !== "ADMIN")) {
      router.replace("/login");
    }
  }, [user, isReady, router]);

  // Fetch des clients
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/admin/customers");
      if (!res.ok) throw new Error("API ERROR");
      const data = await res.json();

      const customersWithTier = data.map((customer: any) => ({
        ...customer,
        loyaltyTier: getTierFromSpent(customer.totalSpent)
      }));

      setCustomers(customersWithTier);
    } catch (err) {
      console.error("❌ ERROR:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchCustomers();
  };

  // Statistiques
  const stats = useMemo(() => {
    const total = customers.length;
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const gold = customers.filter(c => c.loyaltyTier === "gold").length;
    const silver = customers.filter(c => c.loyaltyTier === "silver").length;
    const bronze = customers.filter(c => c.loyaltyTier === "bronze").length;

    return { total, totalSpent, totalOrders, avgOrderValue, gold, silver, bronze };
  }, [customers]);

  // Filtres et tri
  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    if (searchTerm.trim()) {
      result = result.filter(c =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTier !== "all") {
      result = result.filter(c => c.loyaltyTier === selectedTier);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "totalSpent") {
        comparison = a.totalSpent - b.totalSpent;
      } else if (sortBy === "totalOrders") {
        comparison = a.totalOrders - b.totalOrders;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [customers, searchTerm, selectedTier, sortBy, sortOrder]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredAndSortedCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTier]);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* EN-TÊTE MAISON ÉLYSIA */}
          <div className="mb-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    <div className="w-1 h-14 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-1 h-14 bg-gradient-to-b from-amber-400 to-transparent rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-stone-800 via-stone-700 to-stone-600 bg-clip-text text-transparent">
                      Clients Élysia
                    </h1>
                    <p className="text-stone-500 text-sm mt-2 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Gérez, analysez et fidélisez votre clientèle d'exception
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="group relative flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-xl text-stone-600 hover:bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
                >
                  <RefreshCw className={`w-4 h-4 transition-all duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                  <span className="text-sm font-medium">Actualiser</span>
                </button>
                <button className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white hover:shadow-xl hover:shadow-amber-200/50 transition-all duration-300 hover:scale-105">
                  <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  <span className="text-sm font-medium">Exporter</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARTES STATISTIQUES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Clients fidèles"
                value={stats.total}
                icon={Users}
                gradient="from-amber-500 to-orange-500"
                bgGradient="from-amber-50 to-orange-50"
                subtitle="Base clientèle"
            />
            <StatCard
                title="Chiffre d'affaires"
                value={`${stats.totalSpent.toFixed(2)} DT`}
                icon={DollarSign}
                gradient="from-emerald-500 to-green-500"
                bgGradient="from-emerald-50 to-green-50"
                subtitle={`${stats.totalOrders} commandes`}
            />
            <StatCard
                title="Panier moyen"
                value={`${stats.avgOrderValue.toFixed(2)} DT`}
                icon={ShoppingBag}
                gradient="from-purple-500 to-violet-500"
                bgGradient="from-purple-50 to-violet-50"
                subtitle="Par commande"
            />
            <StatCard
                title="Fidélisation"
                value={`${((stats.gold + stats.silver) / stats.total * 100 || 0).toFixed(1)}%`}
                icon={Trophy}
                gradient="from-amber-500 to-orange-500"
                bgGradient="from-amber-50 to-orange-50"
                subtitle={`${stats.gold} VIP, ${stats.silver} Fidèles`}
            />
          </div>

          {/* DISTRIBUTION DES TIERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <TierDistributionCard
                tier="gold"
                count={stats.gold}
                total={stats.total}
                config={tierConfig.gold}
            />
            <TierDistributionCard
                tier="silver"
                count={stats.silver}
                total={stats.total}
                config={tierConfig.silver}
            />
            <TierDistributionCard
                tier="bronze"
                count={stats.bronze}
                total={stats.total}
                config={tierConfig.bronze}
            />
          </div>

          {/* BARRE DE RECHERCHE ET FILTRES */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 p-5 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                    type="text"
                    placeholder="Rechercher un client par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 bg-white"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <FilterButton
                    active={selectedTier === "all"}
                    onClick={() => setSelectedTier("all")}
                    icon={Users}
                    label={`Tous (${stats.total})`}
                    color="stone"
                />
                <FilterButton
                    active={selectedTier === "gold"}
                    onClick={() => setSelectedTier("gold")}
                    icon={Crown}
                    label={`Or (${stats.gold})`}
                    color="amber"
                />
                <FilterButton
                    active={selectedTier === "silver"}
                    onClick={() => setSelectedTier("silver")}
                    icon={Medal}
                    label={`Argent (${stats.silver})`}
                    color="slate"
                />
                <FilterButton
                    active={selectedTier === "bronze"}
                    onClick={() => setSelectedTier("bronze")}
                    icon={Award}
                    label={`Bronze (${stats.bronze})`}
                    color="amber"
                />
              </div>

              <div className="flex gap-2">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2.5 border-2 border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-400 transition-all duration-300 cursor-pointer font-medium"
                >
                  <option value="totalSpent">💰 Par dépenses</option>
                  <option value="totalOrders">📦 Par commandes</option>
                  <option value="name">👤 Par nom</option>
                </select>
                <button
                    onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                    className="px-4 py-2.5 border-2 border-stone-200 rounded-xl text-sm bg-white hover:bg-stone-50 hover:border-amber-300 transition-all duration-300 font-semibold"
                >
                  {sortOrder === "asc" ? "↑ Croissant" : "↓ Décroissant"}
                </button>
              </div>
            </div>
          </div>

          {/* TABLEAU DES CLIENTS */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
            {customers.length === 0 ? (
                <EmptyState icon={Users} title="Aucun client" message="Les clients apparaîtront après leurs premières commandes" />
            ) : filteredAndSortedCustomers.length === 0 ? (
                <EmptyState icon={Filter} title="Aucun résultat" message="Essayez de modifier vos filtres de recherche" />
            ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border-b-2 border-amber-100">
                      <tr>
                        <th className="p-5 text-left text-sm font-semibold text-stone-700">Client</th>
                        <th className="p-5 text-left text-sm font-semibold text-stone-700">Contact</th>
                        <th className="p-5 text-center text-sm font-semibold text-stone-700">Commandes</th>
                        <th className="p-5 text-center text-sm font-semibold text-stone-700">Total dépensé</th>
                        <th className="p-5 text-center text-sm font-semibold text-stone-700">Niveau</th>
                        <th className="p-5 text-center text-sm font-semibold text-stone-700">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {currentCustomers.map((customer, index) => {
                        const tier = tierConfig[customer.loyaltyTier];
                        const TierIcon = tier.icon;
                        return (
                            <tr
                                key={customer.id}
                                className={`group border-b border-amber-50 transition-all duration-300 hover:bg-amber-50/30`}
                            >
                              <td className="p-5">
                                <div className="flex items-center gap-3">
                                  <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${tier.gradient} flex items-center justify-center shadow-lg`}>
                                    <span className="text-white font-bold text-base">
                                      {customer.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-stone-800 group-hover:text-amber-600 transition-colors">
                                      {customer.name}
                                    </p>
                                    <p className="text-xs text-stone-400 font-mono mt-0.5">
                                      #{customer.id}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                                  <span className="text-sm text-stone-600">{customer.email}</span>
                                </div>
                              </td>
                              <td className="p-5 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
                                  <Package className="w-4 h-4 text-amber-500" />
                                  <span className="font-bold text-amber-700">{customer.totalOrders}</span>
                                </div>
                              </td>
                              <td className="p-5 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
                                  <Wallet className="w-4 h-4 text-emerald-500" />
                                  <span className="font-bold text-emerald-700">{customer.totalSpent.toFixed(2)} DT</span>
                                </div>
                              </td>
                              <td className="p-5 text-center">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${tier.bgColor} ${tier.color} border ${tier.borderColor}`}>
                                  <TierIcon className="w-4 h-4" />
                                  {tier.label}
                                </div>
                              </td>
                              <td className="p-5 text-center">
                                <button
                                    onClick={() => handleViewDetails(customer)}
                                    className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-600 transition-all duration-300 hover:scale-110"
                                    title="Voir détails"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                      <div className="flex items-center justify-between px-6 py-5 border-t-2 border-amber-100 bg-gradient-to-r from-amber-50/30 to-white">
                        <div className="text-sm text-stone-600 font-medium">
                          {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredAndSortedCustomers.length)} sur {filteredAndSortedCustomers.length} clients
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className="p-2.5 rounded-xl bg-white border-2 border-stone-200 text-stone-600 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <div className="flex gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              return (
                                  <button
                                      key={pageNum}
                                      onClick={() => setCurrentPage(pageNum)}
                                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 ${
                                          currentPage === pageNum
                                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 scale-110"
                                              : "bg-white border-2 border-stone-200 text-stone-600 hover:bg-amber-50 hover:border-amber-300"
                                      }`}
                                  >
                                    {pageNum}
                                  </button>
                              );
                            })}
                          </div>
                          <button
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                              className="p-2.5 rounded-xl bg-white border-2 border-stone-200 text-stone-600 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  )}
                </>
            )}
          </div>

          {/* TOP CLIENTS - PODIUM */}
          {customers.length > 0 && (
              <div className="mt-8 bg-gradient-to-br from-white to-amber-50/30 rounded-2xl shadow-lg border border-amber-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-800">Top Clients Élysia</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[...customers]
                      .sort((a, b) => b.totalSpent - a.totalSpent)
                      .slice(0, 3)
                      .map((customer, idx) => {
                        const medals = ["🥇", "🥈", "🥉"];
                        const gradients = ["from-amber-400 to-amber-600", "from-stone-400 to-stone-600", "from-amber-400 to-amber-600"];
                        const colors = ["text-amber-600", "text-stone-600", "text-amber-700"];
                        return (
                            <div key={customer.id} className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradients[idx]} opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`}></div>
                              <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradients[idx]} flex items-center justify-center shadow-lg`}>
                                  <span className="text-3xl">{medals[idx]}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-stone-800 text-lg">{customer.name}</p>
                                  <p className="text-xs text-stone-500 mt-1">{customer.totalOrders} commandes</p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-2xl font-bold ${colors[idx]}`}>{customer.totalSpent.toFixed(2)} DT</p>
                                  <p className="text-xs text-stone-400 mt-1">dépensé</p>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                </div>
              </div>
          )}
        </div>

        {/* MODAL DÉTAILS CLIENT */}
        {showDetailsModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className={`bg-gradient-to-r ${tierConfig[selectedCustomer.loyaltyTier].gradient} p-6 rounded-t-2xl text-white`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-3xl font-bold">
                          {selectedCustomer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                        <p className="text-white/80 text-sm">Client {tierConfig[selectedCustomer.loyaltyTier].name}</p>
                      </div>
                    </div>
                    <button
                        onClick={() => setShowDetailsModal(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <p className="text-sm text-amber-600 mb-1">Email</p>
                      <p className="font-semibold text-stone-800">{selectedCustomer.email}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <p className="text-sm text-emerald-600 mb-1">Total dépensé</p>
                      <p className="font-semibold text-stone-800">{selectedCustomer.totalSpent.toFixed(2)} DT</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-600 mb-1">Commandes</p>
                      <p className="font-semibold text-stone-800">{selectedCustomer.totalOrders}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <p className="text-sm text-purple-600 mb-1">Panier moyen</p>
                      <p className="font-semibold text-stone-800">
                        {(selectedCustomer.totalSpent / selectedCustomer.totalOrders || 0).toFixed(2)} DT
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-amber-100 pt-4">
                    <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-500" />
                      Avantages du programme
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tierConfig[selectedCustomer.loyaltyTier].perks.map((perk: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                            {perk}
                          </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

// Composants auxiliaires
function FilterButton({ active, onClick, icon: Icon, label, color }: any) {
  const colors = {
    stone: { active: "from-stone-600 to-stone-700", inactive: "bg-stone-100 text-stone-600 hover:bg-stone-200" },
    amber: { active: "from-amber-500 to-orange-500", inactive: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
    slate: { active: "from-slate-500 to-slate-700", inactive: "bg-slate-50 text-slate-600 hover:bg-slate-100" }
  };

  return (
      <button
          onClick={onClick}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              active
                  ? `bg-gradient-to-r ${colors[color].active} text-white shadow-lg`
                  : colors[color].inactive
          }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
  );
}

function StatCard({ title, value, icon: Icon, gradient, bgGradient, subtitle }: any) {
  return (
      <div className="group relative bg-white rounded-2xl p-6 border border-amber-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgGradient} rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`}></div>
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`} />
          </div>
          <p className="text-3xl font-bold text-stone-800 mb-1">{value}</p>
          <p className="text-sm text-stone-500 font-medium">{title}</p>
          {subtitle && <p className="text-xs text-stone-400 mt-2">{subtitle}</p>}
        </div>
      </div>
  );
}

function TierDistributionCard({ tier, count, total, config }: any) {
  const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
  const Icon = config.icon;

  return (
      <div className="group bg-white rounded-2xl p-5 border border-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-stone-800">{count}</span>
        </div>
        <p className={`font-bold text-lg ${config.color} mb-2`}>{config.name}</p>
        <p className="text-xs text-stone-500 mb-3">{config.description}</p>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-stone-500 mb-2">
            <span className="font-medium">{percentage}% des clients</span>
            <span className="font-medium">{config.threshold}</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
                className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
  );
}

function EmptyState({ icon: Icon, title, message }: any) {
  return (
      <div className="text-center py-20">
        <div className="w-32 h-32 bg-gradient-to-br from-amber-50 to-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-16 h-16 text-amber-400" />
        </div>
        <p className="text-stone-600 font-semibold text-lg">{title}</p>
        <p className="text-stone-400 text-sm mt-2">{message}</p>
      </div>
  );
}

function LoadingSpinner() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-stone-700 font-semibold text-lg">Maison Élysia</p>
            <p className="text-stone-400 text-sm mt-1">Chargement de la clientèle...</p>
          </div>
        </div>
      </div>
  );
}