"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    adresse: "",
    phone: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await register(
        form.email,
        form.name,
        form.password,
        form.adresse,
        form.phone
    );

    router.push("/login");
  };

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
                Rejoignez-nous ✨
              </h2>
              <p className="text-gray-300">
                Créez votre compte et profitez de notre expérience gastronomique
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
                Créer un compte
              </h1>

              <p className="text-gray-400 text-sm">
                Remplissez les informations
              </p>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-4"
            >
              <input
                  placeholder="Nom"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-black/40 text-white outline-none"
              />

              <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-black/40 text-white outline-none"
              />

              <input
                  type="password"
                  placeholder="Mot de passe"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-black/40 text-white outline-none"
              />

              <input
                  placeholder="Adresse"
                  onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-black/40 text-white outline-none"
              />

              <input
                  placeholder="Téléphone"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-black/40 text-white outline-none"
              />

              <button className="w-full h-11 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                S'inscrire
              </button>
            </form>

            {/* 🔥 LOGIN LINK */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Déjà un compte ?{" "}
              <Link
                  href="/login"
                  className="text-orange-400 hover:text-orange-300 font-medium"
              >
                Se connecter
              </Link>
            </div>

          </div>
        </div>
      </div>
  );
}