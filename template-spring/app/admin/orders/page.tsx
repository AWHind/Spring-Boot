"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  MoreVertical
} from "lucide-react";

type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  items: any[];
};

export default function AdminOrdersPage() {

  const router = useRouter();
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auth
  useEffect(() => {
    if (!user) return;
    if (user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [user]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update status
  const updateStatus = async (id: number, status: string) => {
    try {
      if (status === "VALIDATED") {
        await fetch(`http://localhost:8081/api/orders/${id}/validate`, { method: "PUT" });
      }

      if (status === "DELIVERED") {
        await fetch(`http://localhost:8081/api/orders/${id}/deliver`, { method: "PUT" });
      }

      if (status === "CANCELLED") {
        await fetch(`http://localhost:8081/api/orders/${id}`, { method: "DELETE" });
      }

      setOrders(prev =>
          prev.map(o => (o.id === id ? { ...o, status } : o))
      );

    } catch (err) {
      console.error(err);
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (selectedStatus !== "all") {
      result = result.filter(o => o.status === selectedStatus);
    }

    if (searchTerm) {
      result = result.filter(o =>
          o.id.toString().includes(searchTerm) ||
          o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [orders, selectedStatus, searchTerm]);

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    validated: orders.filter(o => o.status === "VALIDATED").length,
    delivered: orders.filter(o => o.status === "DELIVERED").length,
    cancelled: orders.filter(o => o.status === "CANCELLED").length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "En attente", color: "orange", bg: "bg-orange-50", text: "text-orange-600", icon: Clock, border: "border-orange-200" };
      case "VALIDATED":
        return { label: "Confirmée", color: "green", bg: "bg-green-50", text: "text-green-600", icon: CheckCircle, border: "border-green-200" };
      case "DELIVERED":
        return { label: "Livrée", color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600", icon: Truck, border: "border-emerald-200" };
      case "CANCELLED":
        return { label: "Annulée", color: "red", bg: "bg-red-50", text: "text-red-600", icon: XCircle, border: "border-red-200" };
      default:
        return { label: status, color: "gray", bg: "bg-gray-50", text: "text-gray-600", icon: Package, border: "border-gray-200" };
    }
  };

  if (!user) return null;

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Administration</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                  Gestion des commandes
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Gérez toutes les commandes de votre restaurant
                </p>
              </div>

              <button
                  onClick={fetchOrders}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-600 hover:border-orange-300 transition-all shadow-sm"
              >
                <RefreshCw size={16} />
                <span className="text-sm font-medium">Actualiser</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Total</span>
                <Package size={18} className="text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-xs text-gray-400 mt-1">commandes</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">En attente</span>
                <Clock size={18} className="text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-xs text-gray-400 mt-1">à traiter</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Confirmées</span>
                <CheckCircle size={18} className="text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.validated}</div>
              <div className="text-xs text-gray-400 mt-1">validées</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Livrées</span>
                <Truck size={18} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600">{stats.delivered}</div>
              <div className="text-xs text-gray-400 mt-1">terminées</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Annulées</span>
                <XCircle size={18} className="text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-xs text-gray-400 mt-1">annulées</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">CA total</span>
                <DollarSign size={18} className="text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">DT</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    placeholder="Rechercher par ID, nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {["all", "PENDING", "VALIDATED", "DELIVERED", "CANCELLED"].map((status) => {
                  const config = getStatusConfig(status === "all" ? "PENDING" : status);
                  const isActive = selectedStatus === status;
                  const count = status === "all" ? stats.total :
                      status === "PENDING" ? stats.pending :
                          status === "VALIDATED" ? stats.validated :
                              status === "DELIVERED" ? stats.delivered : stats.cancelled;

                  return (
                      <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              isActive
                                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        {status === "all" ? "Toutes" : config.label}
                        <span className={`ml-1 text-xs ${isActive ? "text-white/80" : "text-gray-400"}`}>
                      ({count})
                    </span>
                      </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Chargement des commandes...</p>
              </div>
          ) : currentOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune commande</h3>
                <p className="text-gray-500">Aucune commande ne correspond aux critères</p>
              </div>
          ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-3 bg-gray-50 px-5 py-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Client</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Total</div>
                    <div className="col-span-2">Statut</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-100">
                    {currentOrders.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      const StatusIcon = statusConfig.icon;
                      const orderDate = new Date(order.createdAt);
                      const formattedDate = orderDate.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      });
                      const formattedTime = orderDate.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                          <div key={order.id} className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50 transition-colors">
                            {/* ID */}
                            <div className="col-span-1">
                              <span className="font-mono text-sm font-semibold text-gray-700">#{order.id}</span>
                            </div>

                            {/* Client */}
                            <div className="col-span-3">
                              <div>
                                <p className="font-medium text-gray-800">{order.user?.name || "Client"}</p>
                                <p className="text-xs text-gray-400">{order.user?.email || "Email non disponible"}</p>
                              </div>
                            </div>

                            {/* Date */}
                            <div className="col-span-2">
                              <div className="text-sm text-gray-600">{formattedDate}</div>
                              <div className="text-xs text-gray-400">{formattedTime}</div>
                            </div>

                            {/* Total */}
                            <div className="col-span-2">
                              <span className="text-lg font-bold text-orange-600">{order.total.toFixed(2)} DT</span>
                            </div>

                            {/* Status */}
                            <div className="col-span-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex justify-end gap-2">
                              {/* View Details */}
                              <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
                                  title="Voir détails"
                              >
                                <Eye size={16} />
                              </button>

                              {/* Validate */}
                              {order.status === "PENDING" && (
                                  <button
                                      onClick={() => updateStatus(order.id, "VALIDATED")}
                                      className="p-2 bg-green-100 rounded-lg text-green-600 hover:bg-green-200 transition"
                                      title="Valider"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                              )}

                              {/* Deliver */}
                              {order.status === "VALIDATED" && (
                                  <button
                                      onClick={() => updateStatus(order.id, "DELIVERED")}
                                      className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200 transition"
                                      title="Marquer livrée"
                                  >
                                    <Truck size={16} />
                                  </button>
                              )}

                              {/* Cancel */}
                              {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                                  <button
                                      onClick={() => updateStatus(order.id, "CANCELLED")}
                                      className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition"
                                      title="Annuler"
                                  >
                                    <XCircle size={16} />
                                  </button>
                              )}
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Page {currentPage} sur {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                )}
              </>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Détails commande</h3>
                    <p className="text-gray-500 text-sm">#{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Client Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Informations client</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nom</span>
                        <span className="text-gray-800 font-medium">{selectedOrder.user?.name || "Client"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email</span>
                        <span className="text-gray-800">{selectedOrder.user?.email || "Non disponible"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Détails commande</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="text-gray-800">{new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Statut</span>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getStatusConfig(selectedOrder.status).bg} ${getStatusConfig(selectedOrder.status).text}`}>
                      {getStatusConfig(selectedOrder.status).label}
                    </span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Articles commandés</h4>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm py-2 border-b border-gray-200 last:border-0">
                                <span className="text-gray-700">{item.name || `Produit ${idx + 1}`}</span>
                                <span className="text-gray-600">{item.quantity || 1} x {item.price || 0} DT</span>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}

                  {/* Total */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Total</span>
                      <span className="text-2xl font-bold text-orange-600">{selectedOrder.total.toFixed(2)} DT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}