'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/contexts/CartContext';

export const DishCard = ({ dish }: any) => {
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  //////////////////////////////////////////////////////
  // 🔥 FIX IMAGE (BACKEND URL)
  const cleanImage = (img: string | null | undefined) => {
    if (!img) return 'http://localhost:8081/image/dish-beef.jpg';

    let path = img.trim();

    // إذا ناقص /image
    if (!path.startsWith('/image')) {
      path = `/image/${path}`;
    }

    return `http://localhost:8081${path}`;
  };

  const imageSrc = cleanImage(dish.image);

  //////////////////////////////////////////////////////
  const handleAddToCart = () => {
    addItem(dish, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    setQuantity(1);
  };

  //////////////////////////////////////////////////////
  return (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col">

        {/* ================= IMAGE ================= */}
        <div className="relative w-full h-56 bg-gray-100">

          {/* 🔥 PROMO BADGE */}
          {dish.hasPromo && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs rounded-full z-10 shadow">
                -{dish.discount}%
              </div>
          )}

          <Image
              src={imageError ? 'http://localhost:8081/image/dish-beef.jpg' : imageSrc}
              alt={dish.name || 'dish'}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
          />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-5 flex flex-col gap-3 flex-1">

          <h3 className="font-bold text-lg text-gray-800">
            {dish.name}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2">
            {dish.description}
          </p>

          {/* 🔥 PRICE */}
          {dish.hasPromo ? (
              <div className="flex items-center gap-2">
            <span className="line-through text-gray-400">
              {dish.price} dt
            </span>

                <span className="text-green-500 font-bold text-lg">
              {dish.finalPrice} dt
            </span>
              </div>
          ) : (
              <span className="text-orange-500 font-bold text-lg">
            {dish.price} dt
          </span>
          )}

          {/* ================= CART ================= */}
          <div className="flex items-center gap-2 mt-auto">

            <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              −
            </button>

            <span className="font-semibold">{quantity}</span>

            <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              +
            </button>

            <button
                onClick={handleAddToCart}
                className={`ml-auto px-4 py-2 rounded-lg text-white font-medium transition ${
                    added
                        ? 'bg-green-500'
                        : 'bg-orange-500 hover:bg-orange-600'
                }`}
            >
              {added ? '✓ Ajouté' : 'Commander'}
            </button>

          </div>

        </div>
      </div>
  );
};