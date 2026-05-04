"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminHeader() {

  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { name: "Commandes", href: "/admin/orders", icon: "📦", badge: 12 },
    { name: "Menu", href: "/admin/menu", icon: "📋" },
  ];

  const gestion = [
    { name: "Clients", href: "/admin/customers", icon: "👤" },
    { name: "Promotions", href: "/admin/promotions", icon: "❤️" },
    { name: "Prévisions", href: "/admin/forecast", icon: "📈" },
  ];

  return (
      <div className="w-64 min-h-screen bg-gradient-to-b from-[#0f172a] to-[#111827] text-gray-300 flex flex-col justify-between">

        {/* TOP */}
        <div>

          {/* LOGO */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-white font-bold text-lg">
              Maison Élysia
            </h1>
            <p className="text-xs text-gray-400">
              Restaurant Management
            </p>
          </div>

          {/* PRINCIPAL */}
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-3">PRINCIPAL</p>

            <div className="space-y-2">

              {menu.map((item) => {
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-2 rounded-lg transition
                  ${active
                            ? "bg-orange-500/20 text-orange-400"
                            : "hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                      )}
                    </Link>
                );
              })}

            </div>
          </div>

          {/* GESTION */}
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-3">GESTION</p>

            <div className="space-y-2">

              {gestion.map((item) => {
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition
                  ${active
                            ? "bg-orange-500/20 text-orange-400"
                            : "hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                );
              })}

            </div>
          </div>

        </div>

        {/* BOTTOM USER */}
        <div className="p-4 border-t border-gray-800">

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
              A
            </div>

            <div>
              <p className="text-white text-sm">Admin</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </div>

          <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="text-sm text-gray-400 hover:text-red-400"
          >
            🔓 Déconnexion
          </button>

        </div>

      </div>
  );
}