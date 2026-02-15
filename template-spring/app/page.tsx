'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { mockDishes } from '@/lib/mock-data';

export default function HomePage() {
  const { user } = useAuth();
  
  // Get top 3 dishes for showcase - Exact reference style
  const topDishes = [...mockDishes]
    .filter(d => d.available)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Featured dishes for main section
  const featuredDishes = [...mockDishes]
    .filter(d => d.available)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Professional high-quality dish images from Unsplash - Premium selection
  const dishImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=90&auto=format&fit=crop', // Salad
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=90&auto=format&fit=crop', // Pizza
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=90&auto=format&fit=crop', // Pasta
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=90&auto=format&fit=crop', // Burger
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=90&auto=format&fit=crop', // Steak
    'https://images.unsplash.com/photo-1624353365286-3f8d62daad51', // Fish
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=90&auto=format&fit=crop', // Sushi
    'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=90&auto=format&fit=crop', // Dessert
  ];

  // High-quality food images for title section - Premium selection
  const titleSectionImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95&auto=format&fit=crop', // Fresh Salad
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=95&auto=format&fit=crop', // Gourmet Pizza
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=95&auto=format&fit=crop', // Pasta Carbonara
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=95&auto=format&fit=crop', // Premium Steak
    'https://images.unsplash.com/photo-1563379091339-03246963d4c9?w=400&q=95&auto=format&fit=crop', // Fresh Fish
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=95&auto=format&fit=crop', // Sushi Platter
  ];


  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      {/* Hero Section - Full Screen Clean Version */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">

        {/* Background Image */}
        <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=100&auto=format&fit=crop"
            alt="Elegant restaurant ambiance"
            fill
            className="object-cover blur-sm"
            priority
            quality={100}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight text-white mb-6">
            Le Goût. L’Élégance.  <br />
            <span className="text-[#FF6B35]">L’Excellence.</span>
          </h1>

          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl text-gray-200">
              Une cuisine contemporaine inspirée des grandes traditions.
            </p>
            <p className="text-base sm:text-lg text-gray-300">
              Des saveurs pures, une présentation soignée, une perfection assumée.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center items-center">
            <Link
                href={user ? '/client/menu' : '/menu'}
                className="px-8 py-4 bg-[#FF6B35] text-white rounded-xl font-bold hover:bg-[#FF6B35]/90 transition-all duration-300 hover:scale-105"
            >
              Order Now
            </Link>

            <a
                href="#featured"
                className="px-8 py-4 bg-white/90 text-gray-900 rounded-xl font-bold border-2 border-gray-300 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all duration-300"
            >
              Explore Menu
            </a>
          </div>

        </div>
      </section>

      {/* Featured Dishes Section - Premium Cards with High-Quality Images */}
      <section id="featured" className="relative py-28 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Professional Background Images with Elegant Blur Effect */}
        <div className="absolute inset-0 -z-10">
          {/* Main Background Food Image */}
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90&auto=format&fit=crop"
            alt="Restaurant ambiance background"
            fill
            className="object-cover"
            style={{
              filter: 'blur(3px)',
            }}
            quality={90}
            unoptimized
          />
          {/* Additional Layer for Depth */}
          <div className="absolute inset-0 opacity-25">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=85&auto=format&fit=crop"
              alt="Restaurant interior"
              fill
              className="object-cover mix-blend-overlay"
              style={{
                filter: 'blur(4px)',
              }}
              quality={85}
              unoptimized
            />
          </div>
          {/* Elegant Gradient Overlay - Reduced opacity to show background images */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-gray-50/75 to-gray-50/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-white/15"></div>
        </div>

        {/* Side Decorative Food Images - Professional Placement - More Visible */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block z-0">
          {/* Left Side Images */}
          <div className="absolute left-4 top-1/4 w-52 h-52 rounded-2xl overflow-hidden shadow-2xl opacity-45 rotate-[-10deg] border-4 border-white/70">
            <Image
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=95&auto=format&fit=crop"
              alt="Decorative food"
              fill
              className="object-cover"
              quality={95}
              unoptimized
            />
          </div>
          <div className="absolute left-8 bottom-1/4 w-44 h-44 rounded-xl overflow-hidden shadow-xl opacity-40 rotate-12 border-4 border-white/60">
            <Image
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=95&auto=format&fit=crop"
              alt="Decorative food"
              fill
              className="object-cover"
              quality={95}
              unoptimized
            />
          </div>

          {/* Right Side Images */}
          <div className="absolute right-4 top-1/3 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl opacity-45 rotate-[8deg] border-4 border-white/70">
            <Image
              src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=95&auto=format&fit=crop"
              alt="Decorative food"
              fill
              className="object-cover"
              quality={95}
              unoptimized
            />
          </div>
          <div className="absolute right-8 bottom-1/3 w-56 h-56 rounded-2xl overflow-hidden shadow-2xl opacity-50 rotate-[-12deg] border-4 border-white/70">
            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=95&auto=format&fit=crop"
              alt="Decorative food"
              fill
              className="object-cover"
              quality={95}
              unoptimized
            />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Section Header */}
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900 tracking-tight">Featured Dishes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out our most loved dishes and special selections prepared fresh daily by our expert chefs
            </p>
          </div>

          {/* Featured Dishes Grid - 6 Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredDishes.map((dish, idx) => (
              <div
                key={dish.id}
                className="group relative bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-[#FF6B35]/40 transition-all duration-300"
              >
                {/* Image Section with High-Quality Circular Food Photo */}
                <div className="relative w-full h-80 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center overflow-hidden">
                  {/* Large Circular Food Image */}
                  <div className="relative w-56 h-56 rounded-full bg-white border-8 border-orange-100 shadow-2xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    <Image
                      src={dishImages[idx % dishImages.length]}
                      alt={dish.name}
                      fill
                      className="object-cover"
                      quality={95}
                      unoptimized
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-5">
                  {/* Title and Price */}
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-xl text-gray-900 leading-tight flex-1">{dish.name}</h3>
                    <span className="text-3xl font-bold text-[#FF6B35] whitespace-nowrap">
                      {dish.price.toFixed(2)}dt
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-base text-gray-600 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Rating and Reviews - ORANGE Stars (RoastLux Style) */}
                  <div className="flex items-center gap-3 pt-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(dish.rating) ? 'text-[#FF6B35] fill-[#FF6B35]' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">({dish.reviews} reviews)</span>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={user ? '/client/menu' : '/menu'}
                    className="w-full px-6 py-4 bg-[#FF6B35] text-white rounded-2xl font-bold text-lg hover:bg-[#FF6B35]/90 transition-all duration-200 hover:shadow-xl hover:shadow-[#FF6B35]/30 text-center block mt-4"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-20">
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 px-12 py-6 bg-[#FF6B35] text-white rounded-2xl font-bold text-lg hover:bg-[#FF6B35]/90 transition-all duration-200 hover:shadow-2xl hover:shadow-[#FF6B35]/30"
            >
              View All Dishes
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      {/* Section Localisation */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Title */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Nous Trouver
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Venez vivre une expérience gastronomique unique dans un cadre élégant et chaleureux.
            </p>
          </div>

          {/* Map */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500">
            <iframe
                src="https://www.google.com/maps?q=36.8065,10.1815&z=15&output=embed"
                loading="lazy"
                className="w-full h-[550px]"
                style={{ border: 0 }}
                allowFullScreen
            />

            {/* Subtle Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
          </div>

        </div>
      </section>



      {/* CTA Section */}
      <section className="relative py-28 md:py-36 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Ready to Order?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our complete menu and discover a selection of dishes prepared with passion and expertise by our world-class chefs.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-3 px-12 py-6 bg-[#FF6B35] text-white rounded-2xl font-bold text-lg hover:bg-[#FF6B35]/90 transition-all duration-200 hover:shadow-2xl hover:shadow-[#FF6B35]/30"
          >
            Start Ordering
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
