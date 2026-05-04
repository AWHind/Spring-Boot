"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

type Dish = {
    id: number;
    name: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    image?: string;
};

const BADGES = ["Chef's pick", "Populaire", "Nouveau", "Best seller", "", "Exclusif"];

export default function HomePage() {

    //////////////////////////////////////////////////////
    // 🔥 AUTH REDIRECT (هذا هو الحل)
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        if (user.role === "ADMIN") {
            router.replace("/admin/dashboard");
        } else {
            router.replace("/client/profile");
        }
    }, [user, router]);

    // 👇 يمنع ظهور الصفحة
    if (user) return null;

    //////////////////////////////////////////////////////

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = "http://localhost:8081";

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/dishes`);
                const data = await res.json();

                const safe = Array.isArray(data)
                    ? data.map((d: any) => ({
                        ...d,
                        rating: Number(d.rating) || 5,
                        reviews: Number(d.reviews) || 10,
                    }))
                    : [];

                setDishes(safe);
            } catch (err) {
                console.log("error", err);
                setDishes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, []);


    const featured = dishes.slice(0, 6);

    const getImage = (dish: Dish) => {

        if (!dish.image) {
            return "/image/dish-mille-feuille.jpg";
        }

        let img = dish.image.toLowerCase();
        let name = dish.name?.toLowerCase() || "";

        // 🔥 mapping حسب name أو image
        if (img.includes("escargot") || name.includes("escargot"))
            return "/image/dish-escargots.jpg";

        if (img.includes("soupe") || name.includes("soupe"))
            return "/image/dish-soup.jpg";

        if (img.includes("foie") || name.includes("foie"))
            return "/image/dish-foie-gras.jpg";

        if (img.includes("salade") || name.includes("salade"))
            return "/image/dish-salad.jpg";

        if (img.includes("saumon") || img.includes("salmon") || name.includes("saumon"))
            return "/image/dish-salmon.jpg";

        // 🔥 FIX: beef
        if (name.includes("boeuf") || name.includes("beef"))
            return "/image/dish-beef.jpg";

        // 🔥 FIX: magret (NEW 🔥)
        if (name.includes("magret") || name.includes("canard"))
            return "/image/dish-cidre.jpg"; // ⚠️ لازم الصورة تكون موجودة

        // fallback
        return "/image/dish-mille-feuille.jpg";
    };

    return (
        <div style={{ fontFamily: "'Outfit', sans-serif", background: "#fff", color: "#1a1a1a" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* ═══════════════════════════════
           HERO
        ═══════════════════════════════ */
        .hn-hero {
          position: relative; min-height: 88vh;
          display: flex; align-items: center; overflow: hidden;
        }
        .hn-hero-bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          filter: blur(3px) brightness(0.32) saturate(0.7);
          transform: scale(1.06); transition: transform 8s ease;
        }
        .hn-hero:hover .hn-hero-bg { transform: scale(1.09); }
        .hn-hero-vignette {
          position: absolute; inset: 0; z-index: 1;
          background: radial-gradient(ellipse at 30% 60%, rgba(216,90,48,0.12) 0%, transparent 60%);
        }
        .hn-hero-content {
          position: relative; z-index: 2;
          padding: 4rem 2.5rem; max-width: 700px;
          animation: fadeUp .7s ease both;
        }
        .hn-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(216,90,48,0.18); border: 1px solid rgba(216,90,48,0.35);
          color: #F0997B; font-size: 11px; font-weight: 600;
          letter-spacing: .1em; text-transform: uppercase;
          padding: .35rem 1rem; border-radius: 100px; margin-bottom: 1.5rem;
        }
        .hn-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #D85A30; display: inline-block; }
        .hn-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 900; color: #fff;
          line-height: 1.0; letter-spacing: -.04em; margin-bottom: 1.2rem;
        }
        .hn-hero h1 em { font-style: italic; color: #EF9F27; }
        .hn-hero-sub {
          font-size: 1.05rem; color: rgba(255,255,255,0.7);
          line-height: 1.75; margin-bottom: 2.2rem; max-width: 460px;
        }
        .hn-hero-btns { display: flex; gap: .75rem; flex-wrap: wrap; }
        .hn-btn-main {
          background: #D85A30; color: #fff; border: none;
          padding: .9rem 2.2rem; border-radius: 100px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif; transition: background .2s, transform .15s;
        }
        .hn-btn-main:hover { background: #993C1D; transform: translateY(-2px); }
        .hn-btn-ghost {
          background: rgba(255,255,255,0.06); color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          padding: .9rem 2.2rem; border-radius: 100px;
          font-size: 15px; font-weight: 500; cursor: pointer;
          font-family: 'Outfit', sans-serif; transition: background .2s;
        }
        .hn-btn-ghost:hover { background: rgba(255,255,255,0.12); }
        .hn-stats {
          position: absolute; bottom: 2rem; right: 2.5rem; z-index: 2;
          display: flex; gap: 1px; border-radius: 16px; overflow: hidden;
          border: 0.5px solid rgba(255,255,255,0.15);
        }
        .hn-stat {
          background: rgba(0,0,0,0.6); backdrop-filter: blur(10px);
          padding: 1rem 1.5rem; text-align: center;
        }
        .hn-stat-num { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #fff; }
        .hn-stat-num span { color: #EF9F27; }
        .hn-stat-lbl { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: .07em; margin-top: 2px; }

        /* ═══════════════════════════════
           TRUST BAR
        ═══════════════════════════════ */
        .hn-trust {
          padding: 1.4rem 2.5rem; border-bottom: 1px solid #f0ede8;
          display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
          background: #fafaf8;
        }
        .hn-trust-lbl { font-size: 11px; color: #bbb; text-transform: uppercase; letter-spacing: .1em; white-space: nowrap; }
        .hn-trust-pills { display: flex; gap: .6rem; flex-wrap: wrap; }
        .hn-trust-pill {
          background: #fff; border: 1px solid #e8e4df;
          border-radius: 100px; padding: .3rem .9rem;
          font-size: 12px; font-weight: 500; color: #888;
        }

        /* ═══════════════════════════════
           DISHES — SECTION ULTRA PRO
        ═══════════════════════════════ */
        .hn-dishes-wrap {
          background: #fff;
          padding: 7rem 0 5rem;
        }
        .hn-dishes-header {
          max-width: 1200px; margin: 0 auto;
          padding: 0 2.5rem 4rem;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; flex-wrap: wrap;
        }
        .hn-dishes-left {}
        .hn-eyebrow {
          font-size: 11px; color: #D85A30;
          text-transform: uppercase; letter-spacing: .2em;
          font-weight: 600; margin-bottom: .6rem;
          display: flex; align-items: center; gap: 8px;
        }
        .hn-eyebrow::before {
          content: ''; display: inline-block;
          width: 24px; height: 1.5px; background: #D85A30;
        }
        .hn-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 900; letter-spacing: -.04em;
          color: #1a1a1a; line-height: 1.1;
          max-width: 520px;
        }
        .hn-sec-title em { font-style: italic; color: #D85A30; }
        .hn-sec-title span {
          display: block; font-size: .55em;
          font-weight: 400; color: #999; letter-spacing: 0;
          font-family: 'Outfit', sans-serif; margin-top: .4rem;
        }
        .hn-see-all {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 600; color: #D85A30;
          text-decoration: none; white-space: nowrap;
          border-bottom: 1.5px solid rgba(216,90,48,0.3);
          padding-bottom: 2px; transition: border-color .2s;
        }
        .hn-see-all:hover { border-color: #D85A30; }
        .hn-see-all-arrow { font-size: 18px; transition: transform .2s; }
        .hn-see-all:hover .hn-see-all-arrow { transform: translateX(4px); }

        /* Grid */
        .hn-grid {
          max-width: 1200px; margin: 0 auto; padding: 0 2.5rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-template-rows: auto auto;
          gap: 1.25rem;
        }
        /* Featured card span 2 cols, 2 rows */
        .hn-card-featured {
          grid-column: span 2;
          grid-row: span 2;
          height: 100% !important;
          min-height: 520px;
        }
        @media (max-width: 780px) {
          .hn-grid { grid-template-columns: 1fr; }
          .hn-card-featured { grid-column: span 1; grid-row: span 1; min-height: 340px; }
        }

        .hn-card {
          position: relative; border-radius: 20px; overflow: hidden;
          height: 248px; cursor: pointer;
          border: 1px solid #ede9e3;
          transition: transform .3s, border-color .3s, box-shadow .3s;
        }
        .hn-card:hover {
          transform: translateY(-4px);
          border-color: rgba(216,90,48,0.35);
          box-shadow: 0 16px 48px rgba(216,90,48,0.1);
        }
.hn-card-bg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;

  
  filter: brightness(1) saturate(1.1);

  transform: scale(1.05);
  transition: transform .5s;
}
        .hn-card:hover .hn-card-bg {
          filter: blur(1px) brightness(0.42) saturate(1.1);
          transform: scale(1.13);
        }
        ..hn-card-glow {
  position: absolute;
  inset: 0;
  z-index: 1;

 
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.4),
    transparent 60%
  );
}
        .hn-card-body {
          position: absolute; inset: 0; z-index: 2;
          display: flex; flex-direction: column;
          justify-content: flex-end; padding: 1.5rem;
        }
        .hn-card-featured .hn-card-body { padding: 2rem; }
        .hn-card-badge {
          position: absolute; top: 14px; left: 14px; z-index: 3;
          background: rgba(216,90,48,0.92); color: #fff;
          font-size: 10px; font-weight: 700;
          letter-spacing: .07em; text-transform: uppercase;
          padding: .25rem .75rem; border-radius: 100px;
        }
        .hn-card-rating {
          position: absolute; top: 14px; right: 14px; z-index: 3;
          background: rgba(0,0,0,0.65); color: #EF9F27;
          font-size: 12px; font-weight: 600;
          padding: .25rem .6rem; border-radius: 8px;
        }
        .hn-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem; font-weight: 700; color: #fff;
          line-height: 1.2; margin-bottom: .3rem;
          text-shadow: 0 2px 12px rgba(0,0,0,0.6);
        }
        .hn-card-featured .hn-card-name { font-size: 1.75rem; margin-bottom: .5rem; }
        .hn-card-desc {
          font-size: 12.5px; color: rgba(255,255,255,0.6);
          line-height: 1.5; margin-bottom: .9rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .hn-card-featured .hn-card-desc { font-size: 14px; -webkit-line-clamp: 3; }
        .hn-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .hn-card-price { font-size: 1.1rem; font-weight: 700; color: #EF9F27; }
        .hn-card-featured .hn-card-price { font-size: 1.35rem; }
        .hn-card-btn {
          background: rgba(216,90,48,0.88); color: #fff; border: none;
          padding: .5rem 1.15rem; border-radius: 100px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif; transition: background .2s, transform .15s;
        }
        .hn-card-btn:hover { background: #D85A30; transform: scale(1.04); }

        /* ═══════════════════════════════
           LOCALISATION
        ═══════════════════════════════ */
        .hn-loc {
          background: #fafaf8;
          border-top: 1px solid #f0ede8;
          border-bottom: 1px solid #f0ede8;
          padding: 6rem 2.5rem;
        }
        .hn-loc-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
        }
        @media (max-width: 780px) {
          .hn-loc-inner { grid-template-columns: 1fr; gap: 3rem; }
        }
        .hn-loc-left {}
        .hn-loc-eyebrow {
          font-size: 11px; color: #D85A30; text-transform: uppercase;
          letter-spacing: .2em; font-weight: 600; margin-bottom: .6rem;
          display: flex; align-items: center; gap: 8px;
        }
        .hn-loc-eyebrow::before { content: ''; display: inline-block; width: 24px; height: 1.5px; background: #D85A30; }
        .hn-loc-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 900; letter-spacing: -.03em;
          color: #1a1a1a; line-height: 1.1; margin-bottom: 1.5rem;
        }
        .hn-loc-title em { font-style: italic; color: #D85A30; }
        .hn-loc-desc {
          font-size: 15px; color: #666; line-height: 1.8;
          margin-bottom: 2.5rem; max-width: 420px;
        }
        .hn-loc-infos { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
        .hn-loc-row {
          display: flex; align-items: flex-start; gap: 14px;
        }
        .hn-loc-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: #fff; border: 1px solid #ede9e3;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .hn-loc-info-text {}
        .hn-loc-info-label { font-size: 11px; color: #bbb; text-transform: uppercase; letter-spacing: .08em; font-weight: 600; margin-bottom: 2px; }
        .hn-loc-info-val { font-size: 15px; color: #1a1a1a; font-weight: 500; }
        .hn-loc-info-val a { color: #D85A30; text-decoration: none; }
        .hn-loc-btns { display: flex; gap: .75rem; flex-wrap: wrap; }
        .hn-loc-btn-main {
          display: inline-flex; align-items: center; gap: 8px;
          background: #1a1a1a; color: #fff; border: none;
          padding: .85rem 1.8rem; border-radius: 100px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif; text-decoration: none;
          transition: background .2s, transform .15s;
        }
        .hn-loc-btn-main:hover { background: #333; transform: translateY(-2px); }
        .hn-loc-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #1a1a1a;
          border: 1px solid #ddd;
          padding: .85rem 1.8rem; border-radius: 100px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: 'Outfit', sans-serif; text-decoration: none;
          transition: border-color .2s, background .2s;
        }
        .hn-loc-btn-ghost:hover { border-color: #bbb; background: #f5f5f5; }

        /* Map card */
        .hn-loc-right {}
        .hn-map-card {
          border-radius: 24px; overflow: hidden;
          border: 1px solid #ede9e3;
          box-shadow: 0 20px 60px rgba(0,0,0,0.07);
        }
        .hn-map-frame {
          width: 100%; height: 320px;
          display: block; border: none;
        }
        .hn-map-footer {
          background: #fff; padding: 1.25rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid #f0ede8;
        }
        .hn-map-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; }
        .hn-map-adresse { font-size: 13px; color: #888; margin-top: 2px; }
        .hn-map-open {
          background: #eaf7f0; color: #1a7a4a;
          font-size: 12px; font-weight: 700;
          padding: .3rem .8rem; border-radius: 100px;
          white-space: nowrap;
        }
        /* Open indicator dot */
        .hn-open-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #22c55e; margin-right: 5px; }

        /* ═══════════════════════════════
           CTA
        ═══════════════════════════════ */
        .hn-cta-wrap {
          margin: 5rem 2rem; border-radius: 24px;
          background: #1a1a1a; overflow: hidden; position: relative;
        }
        .hn-cta-inner { padding: 5rem 3rem; text-align: center; position: relative; z-index: 1; }
        .hn-cta-wrap::before {
          content: ''; position: absolute; top: -80px; left: -80px;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(216,90,48,0.1);
        }
        .hn-cta-wrap::after {
          content: ''; position: absolute; bottom: -60px; right: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: rgba(239,159,39,0.07);
        }
        .hn-cta-label { font-size: 11px; color: #EF9F27; text-transform: uppercase; letter-spacing: .15em; font-weight: 600; margin-bottom: .75rem; }
        .hn-cta-h {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; color: #fff;
          letter-spacing: -.03em; margin-bottom: .75rem; line-height: 1.1;
        }
        .hn-cta-h span { color: #EF9F27; font-style: italic; }
        .hn-cta-p { color: rgba(255,255,255,0.5); font-size: 15px; margin-bottom: 2.5rem; }
        .hn-cta-btns { display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; }
        .hn-cta-btn1 {
          background: #D85A30; color: #fff; border: none;
          padding: .9rem 2.2rem; border-radius: 100px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif; transition: background .2s, transform .15s;
        }
        .hn-cta-btn1:hover { background: #993C1D; transform: translateY(-2px); }
        .hn-cta-btn2 {
          background: transparent; color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          padding: .9rem 2.2rem; border-radius: 100px;
          font-size: 15px; font-weight: 500; cursor: pointer;
          font-family: 'Outfit', sans-serif; transition: border-color .2s, background .2s;
        }
        .hn-cta-btn2:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <Header />

            {/* ═══ HERO ═══ */}
            <section className="hn-hero">
                <img
                    className="hn-hero-bg"
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
                    alt=""
                />
                <div className="hn-hero-vignette" />
                <div className="hn-hero-content">
                    <div className="hn-badge">
                        <span className="hn-badge-dot" />
                        Ouvert maintenant
                    </div>
                    <h1>
                        Taste the<br />
                        <em>Excellence</em>
                    </h1>
                    <p className="hn-hero-sub">
                        Une cuisine raffinée, une expérience inoubliable.
                        Savourez chaque instant avec passion.
                    </p>
                    <div className="hn-hero-btns">
                        <Link href="/menu">
                            <button className="hn-btn-main">Commander maintenant</button>
                        </Link>
                        <a href="#menu">
                            <button className="hn-btn-ghost">Explorer le menu</button>
                        </a>
                    </div>
                </div>
                <div className="hn-stats">
                    <div className="hn-stat">
                        <div className="hn-stat-num">4.9<span>★</span></div>
                        <div className="hn-stat-lbl">Note client</div>
                    </div>
                    <div className="hn-stat">
                        <div className="hn-stat-num">2<span>K+</span></div>
                        <div className="hn-stat-lbl">Avis</div>
                    </div>
                    <div className="hn-stat">
                        <div className="hn-stat-num">12<span>ans</span></div>
                        <div className="hn-stat-lbl">D'excellence</div>
                    </div>
                </div>
            </section>

            {/* ═══ TRUST BAR ═══ */}
            <div className="hn-trust">
                <span className="hn-trust-lbl">Reconnu par</span>
                <div className="hn-trust-pills">
                    {["Michelin Guide", "TripAdvisor", "Fourchette d'Or", "Gault & Millau"].map((t) => (
                        <span key={t} className="hn-trust-pill">{t}</span>
                    ))}
                </div>
            </div>

            {/* ═══ DISHES — ULTRA PRO ═══ */}
            <div className="hn-dishes-wrap" id="menu">
                <div className="hn-dishes-header">
                    <div className="hn-dishes-left">
                        <div className="hn-eyebrow">Nos spécialités</div>
                        <div className="hn-sec-title">
                            Des saveurs qui<br />
                            <em>racontent une histoire</em>
                            <span>Chaque plat, une signature. Chaque bouchée, un souvenir.</span>
                        </div>
                    </div>
                    <Link href="/menu" className="hn-see-all">
                        Voir tout le menu
                        <span className="hn-see-all-arrow">→</span>
                    </Link>
                </div>

                {loading ? (
                    <p style={{ color: "#bbb", textAlign: "center", padding: "3rem 0" }}>Chargement...</p>
                ) : (
                    <div className="hn-grid">
                        {featured.map((dish, i) => (
                            <div key={dish.id} className={`hn-card${i === 0 ? " hn-card-featured" : ""}`}>
                                <img className="hn-card-bg" src={getImage(dish)} alt={dish.name} />
                                <div className="hn-card-glow" />
                                {BADGES[i] && <span className="hn-card-badge">{BADGES[i]}</span>}
                                <span className="hn-card-rating">★ {dish.rating} ({dish.reviews})</span>
                                <div className="hn-card-body">
                                    <div className="hn-card-name">{dish.name}</div>
                                    <div className="hn-card-desc">{dish.description}</div>
                                    <div className="hn-card-footer">
                                        <span className="hn-card-price">{dish.price} dt</span>
                                        <Link href="/menu">
                                            <button className="hn-card-btn">Commander</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══ LOCALISATION ═══ */}
            <section className="hn-loc">
                <div className="hn-loc-inner">

                    {/* Left — infos */}
                    <div className="hn-loc-left">
                        <div className="hn-loc-eyebrow">Nous trouver</div>
                        <div className="hn-loc-title">
                            Venez vivre<br />
                            <em>l'expérience</em><br />
                            en salle
                        </div>
                        <p className="hn-loc-desc">
                            Notre restaurant vous accueille dans un cadre chaleureux et raffiné.
                            Réservez votre table et laissez-vous transporter par nos saveurs.
                        </p>

                        <div className="hn-loc-infos">
                            <div className="hn-loc-row">
                                <div className="hn-loc-icon">📍</div>
                                <div className="hn-loc-info-text">
                                    <div className="hn-loc-info-label">Adresse</div>
                                    {/* ← REMPLACE PAR TON ADRESSE */}
                                    <div className="hn-loc-info-val">12 Rue de la Médina, Tunis 1001</div>
                                </div>
                            </div>
                            <div className="hn-loc-row">
                                <div className="hn-loc-icon">🕐</div>
                                <div className="hn-loc-info-text">
                                    <div className="hn-loc-info-label">Horaires</div>
                                    <div className="hn-loc-info-val">Lun – Sam : 12h00 – 23h00</div>
                                </div>
                            </div>
                            <div className="hn-loc-row">
                                <div className="hn-loc-icon">📞</div>
                                <div className="hn-loc-info-text">
                                    <div className="hn-loc-info-label">Téléphone</div>
                                    {/* ← REMPLACE PAR TON NUMÉRO */}
                                    <div className="hn-loc-info-val">
                                        <a href="tel:+21671000000">+216 71 000 000</a>
                                    </div>
                                </div>
                            </div>
                            <div className="hn-loc-row">
                                <div className="hn-loc-icon">🛵</div>
                                <div className="hn-loc-info-text">
                                    <div className="hn-loc-info-label">Livraison</div>
                                    <div className="hn-loc-info-val">Disponible — 30 min en moyenne</div>
                                </div>
                            </div>
                        </div>

                        <div className="hn-loc-btns">
                            {/* ← REMPLACE LE LIEN PAR TES COORDONNÉES GOOGLE MAPS */}
                            <a
                                href="https://maps.google.com/?q=Tunis+Medina"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hn-loc-btn-main"
                            >
                                📍 Ouvrir dans Maps
                            </a>
                            <Link href="/reservation" className="hn-loc-btn-ghost">
                                🗓 Réserver une table
                            </Link>
                        </div>
                    </div>

                    {/* Right — Map embed */}
                    <div className="hn-loc-right">
                        <div className="hn-map-card">
                            {/*
                ← REMPLACE src PAR TON LIEN GOOGLE MAPS EMBED :
                Google Maps → Partager → Intégrer une carte → copie le src de l'iframe
              */}
                            <iframe
                                className="hn-map-frame"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.5!2d10.1658!3d36.8189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis%20Medina!5e0!3m2!1sfr!2stn!4v1699000000000"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Notre localisation"
                            />
                            <div className="hn-map-footer">
                                <div>
                                    {/* ← REMPLACE PAR TON NOM ET ADRESSE */}
                                    <div className="hn-map-name">Restaurant Saveur</div>
                                    <div className="hn-map-adresse">12 Rue de la Médina, Tunis</div>
                                </div>
                                <div className="hn-map-open">
                                    <span className="hn-open-dot" />
                                    Ouvert maintenant
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <div className="hn-cta-wrap">
                <div className="hn-cta-inner">
                    <div className="hn-cta-label">Réservation</div>
                    <div className="hn-cta-h">
                        Prêt pour une <span>expérience</span><br />inoubliable?
                    </div>
                    <p className="hn-cta-p">
                        Réservez votre table ou commandez directement. Livraison en 30 min.
                    </p>
                    <div className="hn-cta-btns">
                        <Link href="/menu">
                            <button className="hn-cta-btn1">Voir le menu complet</button>
                        </Link>
                        <Link href="/reservation">
                            <button className="hn-cta-btn2">Réserver une table</button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
