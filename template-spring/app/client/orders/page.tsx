"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Package, Clock, MapPin, Calendar,
  CheckCircle, XCircle, AlertCircle,
  ShoppingBag, CreditCard,
  Truck, Eye, Star, TrendingUp,
  ChevronDown, ChevronUp, Filter,
  Download, RefreshCw, Bell,
  ArrowRight, Wallet, Gift
} from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`http://localhost:8081/api/orders/user/${user?.id}`);

      if (!res.ok) {
        console.error("API ERROR:", res.status);
        setOrders([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data?.content) {
        setOrders(data.content);
      } else {
        setOrders([]);
      }

    } catch (e) {
      console.error("FETCH ERROR:", e);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { label: "En attente", color: "orange", icon: Clock, bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", badge: "bg-orange-100" };
      case "VALIDATED":
        return { label: "Confirmée", color: "green", icon: CheckCircle, bg: "bg-green-50", text: "text-green-600", border: "border-green-200", badge: "bg-green-100" };
      case "DELIVERED":
        return { label: "Livrée", color: "emerald", icon: Truck, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", badge: "bg-emerald-100" };
      case "REJECTED":
        return { label: "Annulée", color: "red", icon: XCircle, bg: "bg-red-50", text: "text-red-600", border: "border-red-200", badge: "bg-red-100" };
      default:
        return { label: status || "Inconnu", color: "gray", icon: AlertCircle, bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", badge: "bg-gray-100" };
    }
  };

  const filteredOrders = filter === "all"
      ? orders
      : orders.filter(o => o?.status?.toUpperCase() === filter.toUpperCase());

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o?.status?.toUpperCase() === "PENDING").length,
    validated: orders.filter(o => o?.status?.toUpperCase() === "VALIDATED").length,
    delivered: orders.filter(o => o?.status?.toUpperCase() === "DELIVERED").length,
    totalSpent: orders.reduce((sum, o) => sum + (o?.total || 0), 0)
  };

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement de vos commandes...</p>
            </div>
          </div>
          <Footer />
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

          {/* Header Section */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Mes commandes
                  </h1>
                </div>
                <p className="text-gray-500">
                  Suivez l'état de vos commandes en temps réel
                </p>
              </div>

              <div className="flex gap-3">
                <button
                    onClick={fetchOrders}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-600 hover:border-orange-300 transition-all"
                >
                  <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                  <span className="text-sm">Actualiser</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards - White Theme */}
          {orders.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">Total commandes</span>
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <ShoppingBag size={18} className="text-orange-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
                  <div className="text-xs text-gray-400">commandes passées</div>
                </div>

                <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">En attente</span>
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <Clock size={18} className="text-orange-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-1">{stats.pending}</div>
                  <div className="text-xs text-gray-400">à traiter</div>
                </div>

                <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">Confirmées</span>
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">{stats.validated}</div>
                  <div className="text-xs text-gray-400">validées</div>
                </div>

                <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">Total dépensé</span>
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <CreditCard size={18} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalSpent.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">DT</div>
                </div>
              </div>
          )}

          {/* Filter Tabs - White Theme */}
          {orders.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 pb-2 border-b border-gray-200">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        filter === "all"
                            ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Toutes
                  <span className="ml-2 text-xs opacity-75">({stats.total})</span>
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        filter === "pending"
                            ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  En attente
                  <span className="ml-2 text-xs opacity-75">({stats.pending})</span>
                </button>
                <button
                    onClick={() => setFilter("validated")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        filter === "validated"
                            ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Confirmées
                  <span className="ml-2 text-xs opacity-75">({stats.validated})</span>
                </button>
                <button
                    onClick={() => setFilter("delivered")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        filter === "delivered"
                            ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Livrées
                  <span className="ml-2 text-xs opacity-75">({stats.delivered})</span>
                </button>
              </div>
          )}

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {orders.length === 0 ? "Aucune commande" : "Aucune commande dans cette catégorie"}
                </h3>
                <p className="text-gray-500 mb-8">
                  {orders.length === 0
                      ? "Vous n'avez pas encore passé de commande"
                      : "Aucune commande ne correspond à ce filtre"}
                </p>
                {orders.length === 0 && (
                    <button
                        onClick={() => router.push("/client/menu")}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all inline-flex items-center gap-2"
                    >
                      Commander maintenant
                      <ArrowRight size={18} />
                    </button>
                )}
              </div>
          ) : (
              <div className="grid gap-6">
                {filteredOrders.map((o) => {
                  if (!o) return null;

                  const statusConfig = getStatusConfig(o.status);
                  const StatusIcon = statusConfig.icon;
                  const orderDate = o.createdAt ? new Date(o.createdAt) : new Date();
                  const formattedDate = orderDate.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });
                  const formattedTime = orderDate.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const isExpanded = expandedOrder === o.id;

                  return (
                      <div
                          key={o.id}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:border-orange-200"
                      >
                        {/* Card Header */}
                        <div className="p-6">
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            {/* Left Section */}
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 ${statusConfig.bg} rounded-xl flex items-center justify-center`}>
                                <StatusIcon size={20} className={statusConfig.text} />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h2 className="font-bold text-gray-900 text-lg">
                                    Commande #{o.id}
                                  </h2>
                                  <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${statusConfig.badge} ${statusConfig.text} border ${statusConfig.border}`}>
                              {statusConfig.label}
                            </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formattedDate}
                            </span>
                                  <span className="flex items-center gap-1">
                              <Clock size={12} />
                                    {formattedTime}
                            </span>
                                </div>
                              </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="text-xs text-gray-400">Total</span>
                                <p className="font-bold text-xl text-orange-600">
                                  {o.total ?? 0} DT
                                </p>
                              </div>

                              <button
                                  onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                                  className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                              >
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            </div>
                          </div>

                          {/* Quick Info */}
                          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} className="text-gray-400" />
                              <span className="text-gray-600">
                          {o.deliveryAddress?.substring(0, 50) || "Adresse non spécifiée"}
                        </span>
                            </div>
                            {o.notes && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Package size={14} className="text-gray-400" />
                                  <span className="text-gray-500 italic text-sm">
                            Note: {o.notes.substring(0, 40)}
                          </span>
                                </div>
                            )}
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                              <div className="mt-5 pt-5 border-t border-gray-100">
                                <div className="grid md:grid-cols-2 gap-5">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Détails de livraison</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Adresse complète</span>
                                        <span className="text-gray-800">{o.deliveryAddress || "Non spécifiée"}</span>
                                      </div>
                                      {o.notes && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Instructions</span>
                                            <span className="text-gray-600 italic">"{o.notes}"</span>
                                          </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Articles commandés</h4>
                                    {o.items && o.items.length > 0 ? (
                                        <div className="space-y-2">
                                          {o.items.map((item: any, idx: number) => (
                                              <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{item.name || `Produit ${idx + 1}`}</span>
                                                <span className="text-gray-800 font-medium">{item.quantity || 1} x {item.price || 0} DT</span>
                                              </div>
                                          ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Aucun détail disponible</p>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                                  <button
                                      onClick={() => setSelectedOrder(o)}
                                      className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all"
                                  >
                                    <Eye size={16} />
                                    Voir détails complets
                                  </button>
                                </div>
                              </div>
                          )}
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </main>

        <Footer />

        {/* Order Details Modal - White Theme */}
        {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
              <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Détails commande</h3>
                    <p className="text-gray-500 text-sm">#{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 transition-colors">
                    ✕
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Statut</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusConfig(selectedOrder.status).bg}`}></div>
                        <span className={`font-medium ${getStatusConfig(selectedOrder.status).text}`}>
                      {getStatusConfig(selectedOrder.status).label}
                    </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Date de commande</span>
                    <p className="text-gray-900 mt-1">{new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Adresse de livraison</span>
                    <p className="text-gray-900 mt-1">{selectedOrder.deliveryAddress || "Non spécifiée"}</p>
                  </div>

                  {selectedOrder.notes && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Instructions spéciales</span>
                        <p className="text-gray-600 mt-1 italic">"{selectedOrder.notes}"</p>
                      </div>
                  )}

                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Articles</span>
                        <div className="mt-2 space-y-2">
                          {selectedOrder.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm py-2 border-b border-gray-100">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="text-gray-600">{item.quantity} x {item.price} DT</span>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="text-2xl font-bold text-orange-600">{selectedOrder.total ?? 0} DT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}