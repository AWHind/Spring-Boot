"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = useCallback((user: any) => {
    if (!user) return;

    console.log("LOGIN USER:", user);

    localStorage.setItem("user", JSON.stringify(user));

    const role = user.role?.toUpperCase?.() || "";

    if (role.includes("ADMIN")) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/client/profile");
    }
  }, [router]);

  return (
      <div className="min-h-screen flex">

        {/* LEFT IMAGE */}
        <div className="hidden lg:flex w-1/2 relative">
          <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
              alt="restaurant"
              fill
              className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative z-10 text-white p-12 flex flex-col justify-between">
            <div className="text-2xl font-bold">Maison Élysia</div>

            <div>
              <h2 className="text-4xl font-bold mb-4">
                Bienvenue 👋
              </h2>
              <p className="text-gray-300">

              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 flex items-center justify-center bg-[#0f0f13] p-6">
          <div className="w-full max-w-md">

            {/* HEADER */}
            <div className="mb-8 text-center">

              {/* 🔥 HOME BUTTON */}
              <div className="mb-4 text-left">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  ← Accueil
                </Link>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                Se connecter
              </h1>

              <p className="text-gray-400 text-sm">
                Entrez vos identifiants
              </p>
            </div>

            {/* FORM */}
            <AuthForm type="login" onSuccess={handleLoginSuccess} />

            {/* 🔥 REGISTER LINK */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Pas de compte ?{" "}
              <Link
                  href="/register"
                  className="text-orange-400 hover:text-orange-300 font-medium transition"
              >
                Créer un compte
              </Link>
            </div>

          </div>
        </div>
      </div>
  );
}