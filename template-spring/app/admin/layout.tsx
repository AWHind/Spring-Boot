"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
    LayoutDashboard,
    ShoppingBag,
    Utensils,
    Users,
    Gift,
    TrendingUp,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    Settings,
    Crown,
    Sparkles,
    Coffee,
    Star,
    Calendar,
    MessageSquare,
    HelpCircle,
    Zap,
    Gem,
    Shield,
    Compass,
    Leaf,
    Sun,
    Moon,
    Palette,
    Droplet,
    Eye
} from "lucide-react";

export default function AdminLayout({ children }: any) {

    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    const [stats, setStats] = useState({ orders: 0 });
    const [user, setUser] = useState<any>(null);

    /* ================= USER ================= */
    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));
    }, []);

    /* ================= STATS ================= */
    useEffect(() => {
        fetch("http://localhost:8081/api/admin/stats")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(() => {});
    }, []);

    /* ================= CLOCK & DATE ================= */
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
            setCurrentDate(now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
        };
        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    /* ================= MENU ================= */
    const menu = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, description: "Vue d'ensemble" },
        { name: "Commandes", href: "/admin/orders", icon: ShoppingBag, badge: stats.orders, description: "Gestion des commandes" },
        { name: "Carte & Menu", href: "/admin/menu", icon: Utensils, description: "Gestion des plats" },
    ];

    const gestion = [
        { name: "Clients", href: "/admin/customers", icon: Users, description: "Base clients" },
        { name: "Promotions", href: "/admin/promotions", icon: Gift, description: "Offres spéciales" },
        { name: "Prévisions", href: "/admin/forecast", icon: TrendingUp, description: "Analyses & tendances" },
    ];

    const notificationsList = [
        { id: 1, title: "Nouvelle commande #1245", time: "Il y a 2 min", type: "order", color: "amber" },
        { id: 2, title: "Stock faible: Pizza Margherita", time: "Il y a 15 min", type: "alert", color: "red" },
        { id: 3, title: "Avis client 5 étoiles", time: "Il y a 1 heure", type: "review", color: "green" },
        { id: 4, title: "Promotion expirant dans 3 jours", time: "Il y a 2 heures", type: "promo", color: "purple" },
    ];

    /* ================= LOGOUT ================= */
    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    /* ================= NAV ITEM ================= */
    const NavItem = ({ item }: any) => {
        const active = pathname === item.href;

        return (
            <Link
                href={item.href}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${active
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white shadow-lg shadow-amber-500/30"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
            >
                <item.icon size={18} className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} />

                {!collapsed && (
                    <>
                        <span className="text-sm font-medium">{item.name}</span>

                        {item.badge > 0 && (
                            <span className="ml-auto bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                                {item.badge}
                            </span>
                        )}

                        {/* Tooltip when collapsed */}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-xl border border-amber-500/20">
                                {item.name}
                                {item.badge > 0 && ` (${item.badge})`}
                            </div>
                        )}
                    </>
                )}
            </Link>
        );
    };

    const getPageTitle = () => {
        const allItems = [...menu, ...gestion];
        const current = allItems.find(m => m.href === pathname);
        return current?.name || "Administration";
    };

    const getPageDescription = () => {
        const allItems = [...menu, ...gestion];
        const current = allItems.find(m => m.href === pathname);
        return current?.description || "Panneau de contrôle Élysia";
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bonjour";
        if (hour < 18) return "Bon après-midi";
        return "Bonsoir";
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">

            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
            </div>

            {/* ================= SIDEBAR PREMIUM ================= */}
            <aside className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ${collapsed ? "w-20" : "w-80"} shadow-2xl z-40`}>

                {/* Sidebar decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>

                {/* Sidebar border right */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent"></div>

                {/* TOGGLE BUTTON */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-24 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-1.5 rounded-full shadow-xl transition-all duration-300 z-20 ring-2 ring-white/20"
                >
                    {collapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
                </button>

                {/* LOGO SECTION */}
                <div className="p-6 border-b border-white/10 relative">
                    {!collapsed ? (
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl">
                                    <span className="text-2xl">🍽️</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-900"></div>
                            </div>
                            <div>
                                <h1 className="font-bold text-xl tracking-tight">
                                    Maison <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Élysia</span>
                                </h1>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <Gem size={10} className="text-amber-400" />
                                    Restaurant Gastronomique
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                                    <span className="text-xl">🍽️</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* DECORATIVE LINE */}
                <div className="px-4 py-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
                </div>

                {/* MAIN MENU */}
                <div className="p-4 space-y-1">
                    {!collapsed && (
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3 px-2 font-semibold">
                            Navigation principale
                        </p>
                    )}
                    {menu.map((m) => <NavItem key={m.name} item={m} />)}
                </div>

                {/* GESTION SECTION */}
                <div className="p-4 space-y-1 mt-2">
                    {!collapsed && (
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3 px-2 font-semibold">
                            Administration
                        </p>
                    )}
                    {gestion.map((m) => <NavItem key={m.name} item={m} />)}
                </div>

                {/* DECORATIVE SPARKLES */}
                {!collapsed && (
                    <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 opacity-5">
                        <Sparkles size={100} />
                    </div>
                )}

                {/* USER SECTION */}
                <div className="absolute bottom-0 w-full p-4 border-t border-white/10 bg-gradient-to-t from-black/30 to-transparent backdrop-blur-sm">
                    {!collapsed && user && (
                        <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user.name || "Admin User"}</p>
                                <div className="flex items-center gap-1">
                                    <Crown size={10} className="text-amber-400" />
                                    <span className="text-[10px] text-slate-400">Administrateur</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={logout}
                        className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                            text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-500/10 transition-all duration-300"
                    >
                        <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                        {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 flex flex-col min-h-screen relative z-30">

                {/* TOPBAR PREMIUM */}
                <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl shadow-lg border-b border-amber-100/50">
                    <div className="flex justify-between items-center px-6 py-4">

                        {/* Left side - Page info */}
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-1 h-10 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-500 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-1 h-10 bg-gradient-to-b from-amber-400 to-transparent rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                        {getPageTitle()}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Sparkles size={10} className="text-amber-400" />
                                        <p className="text-xs text-amber-600/80 font-medium">
                                            {getPageDescription()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Actions */}
                        <div className="flex items-center gap-2">

                            {/* Date & Time */}
                            <div className="hidden lg:flex flex-col items-end mr-2">
                                <p className="text-xs font-semibold text-slate-700">{currentDate}</p>
                                <p className="text-[10px] text-slate-400">{currentTime}</p>
                            </div>

                            {/* Divider */}
                            <div className="hidden lg:block w-px h-8 bg-amber-200 mx-1"></div>

                            {/* Greeting */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-100">
                                <Coffee size={14} className="text-amber-500" />
                                <span className="text-sm font-medium text-stone-600">
                                    {getGreeting()}, {user?.name?.split(' ')[0] || "Chef"}
                                </span>
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2.5 rounded-xl hover:bg-amber-50 transition-all duration-300 group"
                                >
                                    <Bell size={18} className="text-stone-500 group-hover:text-amber-500 transition-colors" />
                                    {notificationsList.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse ring-2 ring-white"></span>
                                    )}
                                </button>

                                {/* Notifications dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-amber-100 z-50 overflow-hidden animate-fadeIn">
                                        <div className="p-4 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                                            <h3 className="font-bold text-stone-800">Notifications</h3>
                                            <p className="text-xs text-stone-400 mt-0.5">Vous avez {notificationsList.length} notifications</p>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notificationsList.map(notif => (
                                                <div key={notif.id} className={`p-4 hover:bg-${notif.color}-50 transition cursor-pointer border-b border-slate-50 group`}>
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 mt-2 rounded-full bg-${notif.color}-500`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-stone-700 group-hover:text-amber-600 transition">{notif.title}</p>
                                                            <p className="text-xs text-stone-400 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 bg-slate-50 text-center">
                                            <button className="text-xs text-amber-600 hover:text-amber-700 font-medium">Voir toutes les notifications</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Settings */}
                            <button className="p-2.5 rounded-xl hover:bg-amber-50 transition-all duration-300 group">
                                <Settings size={18} className="text-stone-500 group-hover:text-amber-500 transition-colors group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            {/* User menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 ml-2"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md hover:scale-105 transition-transform duration-300">
                                        {user?.name?.charAt(0).toUpperCase() || "A"}
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-amber-100 z-50 overflow-hidden animate-fadeIn">
                                        <div className="p-4 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                                            <p className="font-semibold text-stone-800">{user?.name || "Admin"}</p>
                                            <p className="text-xs text-stone-400 mt-0.5">{user?.email || "admin@elysia.com"}</p>
                                        </div>
                                        <div className="py-2">
                                            <button className="w-full px-4 py-2 text-left text-sm text-stone-600 hover:bg-amber-50 transition flex items-center gap-2">
                                                <UserIcon size={14} /> Mon profil
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-stone-600 hover:bg-amber-50 transition flex items-center gap-2">
                                                <Shield size={14} /> Sécurité
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2">
                                                <LogOut size={14} /> Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <div className="flex-1 p-6 lg:p-8">
                    {children}
                </div>

                {/* FOOTER PREMIUM */}
                <footer className="border-t border-amber-100/50 bg-white/50 backdrop-blur-sm px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <span className="text-xs">🍽️</span>
                                </div>
                                <span className="font-semibold text-stone-600">Maison Élysia</span>
                            </div>
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-400">Gastronomie & Excellence</span>
                        </div>
                        <div className="flex gap-5">
                            <a href="#" className="text-stone-400 hover:text-amber-600 transition flex items-center gap-1">
                                <HelpCircle size={12} /> Aide
                            </a>
                            <a href="#" className="text-stone-400 hover:text-amber-600 transition">Confidentialité</a>
                            <a href="#" className="text-stone-400 hover:text-amber-600 transition">Conditions</a>
                            <span className="text-stone-400">v3.0.0</span>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}

// Helper components
function UserIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}

// Add this to your global CSS or in a style tag
const styles = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
}
`;