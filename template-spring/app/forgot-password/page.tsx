"use client";

import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        alert("Email envoyé (demo)");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f13] text-white">

            <form
                onSubmit={handleSubmit}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4 w-full max-w-md"
            >
                <h1 className="text-2xl font-bold">
                    Mot de passe oublié
                </h1>

                <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-black/40 text-white outline-none"
                />

                <button className="w-full h-11 bg-purple-600 rounded-lg">
                    Envoyer
                </button>

                {/* 🔥 رجوع login */}
                <p className="text-sm text-gray-400 text-center">
                    Retour à{" "}
                    <a href="/login" className="text-purple-400 hover:underline">
                        Se connecter
                    </a>
                </p>

            </form>
        </div>
    );
}