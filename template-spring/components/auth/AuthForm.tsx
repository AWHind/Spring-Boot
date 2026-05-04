"use client";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";

export const AuthForm = ({ type, onSuccess }: any) => {
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const user = await login(email, password);
    if (onSuccess) onSuccess(user);
  };

  return (
      <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl space-y-5"
      >

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
        )}

        {/* EMAIL */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">
            Email
          </label>
          <input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">
            Mot de passe
          </label>

          <div className="relative">
            <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
            />

            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              👁
            </button>
          </div>
        </div>

        {/* OPTIONS */}
        <div className="flex justify-between text-sm text-gray-400">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Se souvenir
          </label>

          <a href="#" className="text-purple-400 hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        {/* BUTTON */}
        <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:scale-[1.02] active:scale-[0.98] transition shadow-lg"
        >
          {isLoading ? (
              <span className="flex justify-center items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Chargement...
          </span>
          ) : (
              "Se connecter"
          )}
        </button>

      </form>
  );
};