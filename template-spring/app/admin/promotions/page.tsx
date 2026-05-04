"use client";

import { useEffect, useState } from "react";
import {
  Tag, Plus, Edit2, Trash2, X, Check,
  Clock, Calendar, Percent, Package,
  AlertCircle, Sparkles, Gift, Zap,
  TrendingUp, Award, Star, Flame
} from "lucide-react";

export default function PromotionsPage() {

  const [dishes, setDishes] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDishId, setSelectedDishId] = useState("");
  const [discount, setDiscount] = useState(10);
  const [duration, setDuration] = useState(1);
  const [unit, setUnit] = useState("day");

  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, p] = await Promise.all([
        fetch("http://localhost:8081/api/dishes"),
        fetch("http://localhost:8081/api/promotions")
      ]);
      setDishes(await d.json());
      setPromos(await p.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createPromo = async () => {
    if (!selectedDishId) {
      alert("Veuillez sélectionner un plat");
      return;
    }

    await fetch("http://localhost:8081/api/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discount,
        dishIds: [Number(selectedDishId)],
        duration,
        unit
      })
    });

    resetForm();
    fetchData();
    setShowForm(false);
  };

  const updatePromo = async () => {
    if (!editId) return;

    await fetch(`http://localhost:8081/api/promotions/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discount })
    });

    resetForm();
    fetchData();
  };

  const deletePromo = async (id: number) => {
    await fetch(`http://localhost:8081/api/promotions/${id}`, {
      method: "DELETE"
    });
    setDeleteConfirm(null);
    fetchData();
  };

  const handleEdit = (p: any) => {
    setEditId(p.id);
    setDiscount(p.discount);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditId(null);
    setSelectedDishId("");
    setDiscount(10);
    setDuration(1);
    setUnit("day");
    setShowForm(false);
  };

  const getDishName = (dishId: number) => {
    const dish = dishes.find(d => d.id === dishId);
    return dish?.name || "Plat";
  };

  const getRemainingTime = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} heures restantes`;
    const days = Math.floor(hours / 24);
    return `${days} jours restants`;
  };

  const activePromos = promos.filter(p => new Date(p.endDate) > new Date());
  const expiredPromos = promos.filter(p => new Date(p.endDate) <= new Date());

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des promotions...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Gestion des offres</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2">
                  Promotions
                  <Sparkles size={24} className="text-orange-500" />
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Créez et gérez vos offres promotionnelles
                </p>
              </div>

              <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all"
              >
                {showForm ? <X size={18} /> : <Plus size={18} />}
                {showForm ? "Fermer" : "Nouvelle promotion"}
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-50 rounded-xl">
                  <Gift size={20} className="text-orange-500" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{promos.length}</span>
              </div>
              <p className="text-gray-600 font-medium">Total promotions</p>
              <p className="text-xs text-gray-400 mt-1">Toutes confondues</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-50 rounded-xl">
                  <Zap size={20} className="text-green-500" />
                </div>
                <span className="text-2xl font-bold text-green-600">{activePromos.length}</span>
              </div>
              <p className="text-gray-600 font-medium">Promotions actives</p>
              <p className="text-xs text-gray-400 mt-1">En cours de validité</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <Clock size={20} className="text-gray-500" />
                </div>
                <span className="text-2xl font-bold text-gray-500">{expiredPromos.length}</span>
              </div>
              <p className="text-gray-600 font-medium">Promotions expirées</p>
              <p className="text-xs text-gray-400 mt-1">À renouveler</p>
            </div>
          </div>

          {/* FORM - CREATION */}
          {showForm && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                <div className={`p-5 ${editId ? 'bg-blue-50' : 'bg-gradient-to-r from-orange-50 to-orange-100/30'} border-b border-gray-100`}>
                  <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    {editId ? <Edit2 size={18} className="text-blue-500" /> : <Tag size={18} className="text-orange-500" />}
                    {editId ? "Modifier la promotion" : "Créer une nouvelle promotion"}
                  </h2>
                </div>

                <div className="p-6">
                  {!editId && (
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plat concerné
                        </label>
                        <select
                            value={selectedDishId}
                            onChange={(e) => setSelectedDishId(e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        >
                          <option value="">Sélectionner un plat</option>
                          {dishes.map(d => (
                              <option key={d.id} value={d.id}>
                                🍽️ {d.name} - {d.price} DT
                              </option>
                          ))}
                        </select>
                      </div>
                  )}

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pourcentage de réduction
                    </label>
                    <div className="relative">
                      <Percent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          placeholder="10"
                      />
                    </div>
                  </div>

                  {!editId && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durée de validité
                        </label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                          <select
                              value={unit}
                              onChange={(e) => setUnit(e.target.value)}
                              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
                          >
                            <option value="hour">Heures</option>
                            <option value="day">Jours</option>
                          </select>
                        </div>
                      </div>
                  )}

                  <div className="flex gap-3">
                    {editId ? (
                        <>
                          <button
                              onClick={updatePromo}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg transition-all text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                          >
                            <Check size={18} />
                            Sauvegarder
                          </button>
                          <button
                              onClick={resetForm}
                              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
                          >
                            Annuler
                          </button>
                        </>
                    ) : (
                        <button
                            onClick={createPromo}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-200 transition-all text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                          <Plus size={18} />
                          Créer la promotion
                        </button>
                    )}
                  </div>
                </div>
              </div>
          )}

          {/* DELETE CONFIRMATION MODAL */}
          {deleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                  <div className="text-center mb-5">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Confirmer la suppression</h3>
                    <p className="text-gray-500 mt-2">
                      Êtes-vous sûr de vouloir supprimer cette promotion ?
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                    >
                      Annuler
                    </button>
                    <button
                        onClick={() => deletePromo(deleteConfirm)}
                        className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* ACTIVE PROMOTIONS */}
          {activePromos.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={20} className="text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-800">Promotions actives</h2>
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">{activePromos.length}</span>
                </div>

                <div className="grid gap-4">
                  {activePromos.map(p => (
                      <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                        <div className="p-5">
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                                <Percent size={24} className="text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-xl text-gray-800">-{p.discount}%</h3>
                                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                              Active
                            </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {getDishName(p.dishIds?.[0])}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Fin: {new Date(p.endDate).toLocaleDateString()}
                            </span>
                                  <span className="flex items-center gap-1">
                              <Clock size={12} />
                                    {getRemainingTime(p.endDate)}
                            </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                  onClick={() => handleEdit(p)}
                                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                  onClick={() => setDeleteConfirm(p.id)}
                                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* EXPIRED PROMOTIONS */}
          {expiredPromos.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-800">Promotions expirées</h2>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">{expiredPromos.length}</span>
                </div>

                <div className="grid gap-3">
                  {expiredPromos.map(p => (
                      <div key={p.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 opacity-75">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                              <Tag size={18} className="text-gray-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-600">-{p.discount}%</p>
                              <p className="text-xs text-gray-400">{getDishName(p.dishIds?.[0])}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              Expirée le {new Date(p.endDate).toLocaleDateString()}
                            </p>
                            <button
                                onClick={() => setDeleteConfirm(p.id)}
                                className="text-xs text-red-500 hover:text-red-600 mt-1"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* EMPTY STATE */}
          {promos.length === 0 && !showForm && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift size={32} className="text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune promotion</h3>
                <p className="text-gray-500 mb-6">Créez votre première promotion pour attirer plus de clients</p>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  + Nouvelle promotion
                </button>
              </div>
          )}

          {/* FOOTER */}
          <footer className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Tag size={12} />
                <span>Gestion des promotions</span>
              </div>
              <div className="flex gap-4">
                <span>© 2024 Tous droits réservés</span>
                <span>Version 1.0.0</span>
              </div>
            </div>
          </footer>

        </div>
      </div>
  );
}