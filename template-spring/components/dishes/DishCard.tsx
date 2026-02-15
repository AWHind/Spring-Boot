'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dish } from '@/lib/types';
import { useCart } from '@/lib/contexts/CartContext';
import { ImagePlaceholder } from '@/components/common/ImagePlaceholder';

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    addItem(dish, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
  };

  // High-quality dish images
  const dishImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=95&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=95&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=95&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=95&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563379091339-03246963d4c9?w=600&q=95&auto=format&fit=crop',
  ];

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#FF6B35]/40 transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-[#FF6B35]/20 hover:-translate-y-1 group">
      {/* High-Quality Food Image */}
      <div className="w-full h-56 bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
        {!imageError && dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            quality={95}
            unoptimized
          />
        ) : (
          <Image
            src={dishImages[Math.floor(Math.random() * dishImages.length)]}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            quality={95}
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col space-y-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1">{dish.name}</h3>
          <span className="text-[#FF6B35] font-black text-xl whitespace-nowrap">
            {dish.price.toFixed(2)}dt
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">
          {dish.description}
        </p>

        {/* Category Badge */}
        <div>
          <span className="inline-block px-3 py-1.5 bg-[#FF6B35]/10 text-[#FF6B35] text-xs rounded-full font-bold border border-[#FF6B35]/20">
            {dish.category === 'appetizers' && 'Entrées'}
            {dish.category === 'main' && 'Plats'}
            {dish.category === 'desserts' && 'Desserts'}
            {dish.category === 'beverages' && 'Boissons'}
            {dish.category === 'specials' && 'Spécialités'}
          </span>
        </div>

        {/* Rating - Orange Stars */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(dish.rating)
                    ? 'text-[#FF6B35] fill-[#FF6B35]'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            ({dish.reviews} avis)
          </span>
        </div>

        {/* Quantity & Add Button */}
        <div className="flex gap-3 mt-auto pt-2">
          <div className="flex items-center border-2 border-gray-200 rounded-xl bg-gray-50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-gray-700 hover:bg-gray-200 hover:text-[#FF6B35] transition-colors font-bold rounded-l-xl"
            >
              −
            </button>
            <span className="px-4 py-2 text-sm font-bold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-gray-700 hover:bg-gray-200 hover:text-[#FF6B35] transition-colors font-bold rounded-r-xl"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all text-sm ${
              added
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 hover:shadow-xl hover:shadow-[#FF6B35]/30'
            }`}
          >
            {added ? '✓ Ajouté' : 'Commander'}
          </button>
        </div>
      </div>
    </div>
  );
};
