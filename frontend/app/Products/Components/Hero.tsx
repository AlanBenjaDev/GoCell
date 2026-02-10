"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';

export default function Hero() {
  return (
    <section className="bg-black py-4"> 
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          navigation={true}
          pagination={{ clickable: true }}
          mousewheel={true}
          keyboard={true}
          autoplay={{ delay: 5000 }} // Agregué autoplay para dinamismo
          modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
          className="mySwiper rounded-2xl overflow-hidden border border-emerald-900/20"
          style={{
            // @ts-ignore - Personalización de variables de Swiper a tu verde
            "--swiper-navigation-color": "#10b981", 
            "--swiper-pagination-color": "#10b981",
            "--swiper-pagination-bullet-inactive-color": "#4b5563",
          }}
        >
          {[
            { src: "/descuento.jpg", alt: "Ofertas de tecnología" },
            { src: "/Gemini_Generated_Image_jwejjjwejjjwejjj.png", alt: "Nuevos Celulares" },
            { src: "/Gemini_Generated_Image_us9rjnus9rjnus9r.png", alt: "Auriculares Premium" },
            { src: "/supermercado.jpg", alt: "Accesorios en promoción" },
          ].map((slide, index) => (
            <SwiperSlide key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              
              <Image
                src={slide.src}
                alt={slide.alt}
                width={1920}
                height={800}
                className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                priority={index === 0}
              />
              
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  Destacado
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
