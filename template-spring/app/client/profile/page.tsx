"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import {
    User, Mail, Phone, MapPin, LogOut,
    Edit2, Check, X, Star, Settings,
    Shield, Bell, CreditCard, Package
} from "lucide-react";

const ORANGE = "#E87B2C";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<any>({});
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/");
            return;
        }
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setForm(parsed);
        setLoading(false);
    }, [router]);

    const handleSave = () => {
        setUser(form);
        localStorage.setItem("user", JSON.stringify(form));
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleCancel = () => {
        setForm(user);
        setIsEditing(false);
    };

    const initials = user?.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ?? "?";

    const profileFields = [
        { key: "name", label: "Nom complet", icon: User, placeholder: "Votre nom" },
        { key: "email", label: "Adresse email", icon: Mail, placeholder: "exemple@email.com" },
        { key: "phone", label: "Téléphone", icon: Phone, placeholder: "+216 XX XXX XXX" },
        { key: "adresse", label: "Adresse", icon: MapPin, placeholder: "Votre adresse complète" }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
            <Header />

            {/* Toast Notification */}
            {saved && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-5 py-2.5 rounded-full shadow-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-5">
                    <Check size={16} />
                    Profil mis à jour avec succès ✅
                </div>
            )}

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                {/* Profile Header */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">

                    {/* Sidebar - Profile Card */}
                    <div className="lg:w-80">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
                            {/* Cover Image */}
                            <div className="h-24 bg-gradient-to-r from-orange-400 to-orange-600"></div>

                            {/* Avatar */}
                            <div className="relative px-6 pb-6">
                                <div className="flex justify-center -mt-12 mb-4">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-3xl font-bold flex items-center justify-center shadow-lg border-4 border-white">
                                            {initials}
                                        </div>
                                        <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                                            <Edit2 size={12} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>

                                    <div className="flex items-center justify-center gap-2 mt-3">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                                            <Star size={12} fill="#E87B2C" />
                                            Client fidèle
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                            <Shield size={12} />
                                            Vérifié
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-0 border-t border-gray-100">
                                <div className="text-center py-4">
                                    <div className="text-xl font-bold text-gray-900">12</div>
                                    <div className="text-xs text-gray-500">Commandes</div>
                                </div>
                                <div className="text-center py-4 border-l border-r border-gray-100">
                                    <div className="text-xl font-bold text-gray-900">256</div>
                                    <div className="text-xs text-gray-500">Points</div>
                                </div>
                                <div className="text-center py-4">
                                    <div className="text-xl font-bold text-gray-900">2024</div>
                                    <div className="text-xs text-gray-500">Membre depuis</div>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="border-t border-gray-100">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all ${
                                        activeTab === "profile"
                                            ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <User size={16} />
                                    <span>Informations personnelles</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all ${
                                        activeTab === "security"
                                            ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Shield size={16} />
                                    <span>Sécurité</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("notifications")}
                                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all ${
                                        activeTab === "notifications"
                                            ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Bell size={16} />
                                    <span>Notifications</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("payments")}
                                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all ${
                                        activeTab === "payments"
                                            ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <CreditCard size={16} />
                                    <span>Moyens de paiement</span>
                                </button>
                            </div>

                            {/* Logout Button */}
                            <div className="border-t border-gray-100 p-4">
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("user");
                                        router.push("/");
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">

                        {/* Profile Information Tab */}
                        {activeTab === "profile" && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
                                        <p className="text-sm text-gray-500 mt-1">Gérez vos informations de compte</p>
                                    </div>

                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-100 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                            Modifier
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                                            >
                                                <X size={16} />
                                                Annuler
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                                            >
                                                <Check size={16} />
                                                Enregistrer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {profileFields.map(({ key, label, icon: Icon, placeholder }) => (
                                        <div key={key} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                                <Icon size={18} className="text-orange-500" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {label}
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        value={form[key] || ""}
                                                        onChange={(e) => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                                                        placeholder={placeholder}
                                                        className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                                    />
                                                ) : (
                                                    <p className={`mt-1 text-sm ${!user[key] ? "text-gray-400 italic" : "text-gray-800"}`}>
                                                        {user[key] || "Non renseigné"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
                                    <p class="text-sm text-gray-500 mt-1">Gérez votre sécurité et vos mots de passe</p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">Mot de passe</p>
                                            <p className="text-sm text-gray-500">Modifiez votre mot de passe</p>
                                        </div>
                                        <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            Changer
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">Authentification à deux facteurs</p>
                                            <p className="text-sm text-gray-500">Sécurisez votre compte</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-500">Désactivé</span>
                                            <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                                Activer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === "notifications" && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                    <p className="text-sm text-gray-500 mt-1">Gérez vos préférences de notification</p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {[
                                        { label: "Commandes", desc: "Notifications sur l'état de vos commandes", enabled: true },
                                        { label: "Promotions", desc: "Offres spéciales et réductions", enabled: true },
                                        { label: "Newsletter", desc: "Actualités et nouveautés", enabled: false }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.label}</p>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                            <div className={`w-10 h-5 rounded-full ${item.enabled ? "bg-orange-500" : "bg-gray-300"} relative cursor-pointer transition-colors`}>
                                                <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${item.enabled ? "right-0.5" : "left-0.5"}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payments Tab */}
                        {activeTab === "payments" && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Moyens de paiement</h3>
                                    <p className="text-sm text-gray-500 mt-1">Gérez vos cartes et méthodes de paiement</p>
                                </div>
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CreditCard size={24} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-600">Aucune carte enregistrée</p>
                                    <button className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
                                        + Ajouter une carte
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Recent Orders Preview */}
                        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
                                    <p className="text-sm text-gray-500 mt-1">Vos 3 dernières commandes</p>
                                </div>
                                <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                                    Voir tout
                                </button>
                            </div>
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500">Aucune commande récente</p>
                                <button className="mt-4 text-orange-500 text-sm font-medium hover:text-orange-600">
                                    Commander maintenant →
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}