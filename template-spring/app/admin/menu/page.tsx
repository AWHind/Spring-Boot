"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Edit, X, Upload, Search, Filter, Grid3x3, Package, Star, TrendingUp, Clock, AlertCircle } from "lucide-react";

/* ================= TYPES ================= */
type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  finalPrice?: number;
  hasPromo?: boolean;
  discount?: number;
};

/* ================= PAGE ================= */
export default function AdminMenuPage() {

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "MAIN",
    image: ""
  });

  const [editData, setEditData] = useState<Dish | null>(null);

  /* ================= FETCH ================= */
  const fetchDishes = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/dishes");
      const data = await res.json();
      setDishes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  /* ================= FILTER ================= */
  const filteredDishes = dishes.filter(d => {
    const matchCategory = selectedCategory === "ALL" || d.category === selectedCategory;
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  /* ================= UPLOAD ================= */
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8081/api/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    return data.imageUrl || "";
  };

  /* ================= ADD ================= */
  const handleSaveDish = async () => {
    let imagePath = "";
    if (selectedFile) {
      imagePath = await uploadImage(selectedFile);
    }

    await fetch("http://localhost:8081/api/dishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        image: imagePath
      })
    });

    fetchDishes();
    setShowForm(false);
    setFormData({ name: "", description: "", price: "", category: "MAIN", image: "" });
    setPreviewUrl("");
    setSelectedFile(null);
  };

  /* ================= EDIT ================= */
  const handleEditClick = (dish: any) => {
    const { finalPrice, hasPromo, discount, ...cleanDish } = dish;
    setEditData({ ...cleanDish });
    setEditPreviewUrl(dish.image);
    setEditSelectedFile(null);
    setShowEditForm(true);
  };

  const handleUpdateDish = async () => {
    if (!editData) return;
    let imagePath = editData.image;
    if (editSelectedFile) {
      imagePath = await uploadImage(editSelectedFile);
    }

    await fetch(`http://localhost:8081/api/dishes/${editData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editData,
        price: Number(editData.price),
        image: imagePath
      })
    });

    fetchDishes();
    setShowEditForm(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")) {
      await fetch(`http://localhost:8081/api/dishes/${id}`, { method: "DELETE" });
      setDishes(prev => prev.filter(d => d.id !== id));
    }
  };

  /* ================= FILE SELECT ================= */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditSelectedFile(file);
    setEditPreviewUrl(URL.createObjectURL(file));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MAIN: "bg-blue-100 text-blue-700",
      PIZZA: "bg-red-100 text-red-700",
      DRINK: "bg-green-100 text-green-700",
      DESSERT: "bg-pink-100 text-pink-700",
      STARTER: "bg-amber-100 text-amber-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      MAIN: "Plat principal",
      PIZZA: "Pizza",
      DRINK: "Boisson",
      DESSERT: "Dessert",
      STARTER: "Entrée"
    };
    return labels[category] || category;
  };

  if (loading) {
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
              <p className="text-stone-700 font-semibold text-lg">Chargement du menu</p>
              <p className="text-stone-400 text-sm mt-1">Maison Élysia</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-50">
        <div className="p-6 lg:p-8">

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                    🍽️ Carte & Menu
                  </h1>
                  <p className="text-stone-500 text-sm mt-1">Gérez tous vos plats en un seul endroit</p>
                </div>
              </div>
            </div>

            <button
                onClick={() => setShowForm(true)}
                className="group flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              <span className="font-medium">Ajouter un plat</span>
            </button>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-500 text-sm">Total plats</p>
                  <p className="text-2xl font-bold text-stone-800">{dishes.length}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-amber-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-500 text-sm">En promotion</p>
                  <p className="text-2xl font-bold text-stone-800">{dishes.filter(d => d.hasPromo).length}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-red-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-500 text-sm">Catégories</p>
                  <p className="text-2xl font-bold text-stone-800">{new Set(dishes.map(d => d.category)).size}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Grid3x3 size={20} className="text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                    type="text"
                    placeholder="Rechercher un plat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {["ALL", "MAIN", "PIZZA", "STARTER", "DESSERT", "DRINK"].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            selectedCategory === cat
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                    >
                      {cat === "ALL" ? "Tous" : getCategoryLabel(cat)}
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* CARDS GRID */}
          {filteredDishes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-12 text-center">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={40} className="text-amber-400" />
                </div>
                <p className="text-stone-600 font-semibold text-lg">Aucun plat trouvé</p>
                <p className="text-stone-400 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDishes.map(dish => (
                    <div
                        key={dish.id}
                        className="group bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                            src={dish.image || "/placeholder.jpg"}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg"; }}
                        />
                        {dish.hasPromo && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                              -{dish.discount}%
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(dish.category)}`}>
                      {getCategoryLabel(dish.category)}
                    </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-stone-800 group-hover:text-amber-600 transition-colors">
                          {dish.name}
                        </h3>
                        <p className="text-stone-500 text-sm mt-1 line-clamp-2">
                          {dish.description || "Aucune description"}
                        </p>

                        {/* PRICE */}
                        <div className="mt-3">
                          {dish.hasPromo ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-stone-400 text-sm line-through">{dish.price} dt</span>
                                <span className="text-xl font-bold text-emerald-600">{dish.finalPrice} dt</span>
                                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                          -{dish.discount}%
                        </span>
                              </div>
                          ) : (
                              <p className="text-xl font-bold text-amber-600">{dish.price} dt</p>
                          )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-stone-100">
                          <button
                              onClick={() => handleEditClick(dish)}
                              className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-500 hover:text-amber-600 transition-all duration-300 hover:scale-110"
                              title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                              onClick={() => handleDelete(dish.id)}
                              className="p-2 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-600 transition-all duration-300 hover:scale-110"
                              title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* ADD FORM MODAL */}
          {showForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center p-5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white rounded-t-2xl">
                    <h2 className="text-xl font-bold text-stone-800">Ajouter un plat</h2>
                    <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-stone-100 transition">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <input
                        placeholder="Nom du plat"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-2 border-stone-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    />

                    <input
                        placeholder="Prix (DT)"
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="w-full border-2 border-stone-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    />

                    <div>
                      <div className="flex gap-3">
                        <input type="file" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} className="hidden" />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                        >
                          <Upload size={16} /> Choisir image
                        </button>
                        {previewUrl && <span className="text-sm text-emerald-600">✓ Image sélectionnée</span>}
                      </div>
                      {previewUrl && (
                          <div className="mt-2">
                            <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-xl shadow" />
                          </div>
                      )}
                    </div>

                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full border-2 border-stone-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    >
                      <option value="MAIN">Plat principal</option>
                      <option value="STARTER">Entrée</option>
                      <option value="DESSERT">Dessert</option>
                      <option value="DRINK">Boisson</option>
                      <option value="PIZZA">Pizza</option>
                    </select>

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full border-2 border-stone-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 p-5 border-t border-amber-100 bg-stone-50 rounded-b-2xl">
                    <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl font-medium transition">
                      Annuler
                    </button>
                    <button onClick={handleSaveDish} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-md transition">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* EDIT FORM MODAL */}
          {showEditForm && editData && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center p-5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white rounded-t-2xl">
                    <h2 className="text-xl font-bold text-stone-800">Modifier le plat</h2>
                    <button onClick={() => setShowEditForm(false)} className="p-1 rounded-lg hover:bg-stone-100 transition">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <input
                        value={editData.name}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                        className="w-full border-2 border-stone-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    />

                    <input
                        type="number"
                        step="0.01"
                        value={editData.price}
                        onChange={e => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                        className="w-full border-2 border-stone-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    />

                    <div>
                      <div className="flex gap-3">
                        <input type="file" accept="image/*" onChange={handleEditFileSelect} ref={editFileInputRef} className="hidden" />
                        <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                        >
                          <Upload size={16} /> Changer image
                        </button>
                      </div>
                      {editPreviewUrl && (
                          <div className="mt-2">
                            <img src={editPreviewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-xl shadow" />
                          </div>
                      )}
                    </div>

                    <select
                        value={editData.category}
                        onChange={e => setEditData({ ...editData, category: e.target.value })}
                        className="w-full border-2 border-stone-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    >
                      <option value="MAIN">Plat principal</option>
                      <option value="STARTER">Entrée</option>
                      <option value="DESSERT">Dessert</option>
                      <option value="DRINK">Boisson</option>
                      <option value="PIZZA">Pizza</option>
                    </select>

                    <textarea
                        value={editData.description}
                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                        rows={3}
                        className="w-full border-2 border-stone-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 p-5 border-t border-amber-100 bg-stone-50 rounded-b-2xl">
                    <button onClick={() => setShowEditForm(false)} className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl font-medium transition">
                      Annuler
                    </button>
                    <button onClick={handleUpdateDish} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium shadow-md transition">
                      Mettre à jour
                    </button>
                  </div>
                </div>
              </div>
          )}

        </div>
      </div>
  );
}