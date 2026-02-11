"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Zap } from "lucide-react"; // Importa iconos para el toque profesional

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
}

export default function ProductList() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${API_URL}/products/products`); 
        if (!res.ok) throw new Error("Error al traer productos");
        const data: Product[] = await res.json();
        setProductList(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-red-400 bg-black">
      <p className="text-xl font-bold">⚠️ {error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 text-emerald-500 underline">Reintentar</button>
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#051101] py-20 px-6 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-emerald-900/30 border-t-emerald-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
        <p className="text-emerald-500/70 font-medium animate-pulse">Sincronizando stock...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Tecnología <span className="text-emerald-500 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Destacada</span>
            </h1>
            <div className="h-[1px] flex-grow mx-8 bg-gradient-to-r from-emerald-500/50 to-transparent hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map((product) => (
            <div key={product.id} className="group relative bg-[#0a0a0a] border border-emerald-900/20 rounded-2xl p-4 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col">
              
              {product.precio > 15000 && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg">
                  <Zap size={10} fill="black" /> ENVÍO GRATIS
                </div>
              )}

              <Link href={`/Products/${product.id}`} className="cursor-pointer">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-neutral-900">
                  <img
                    src={product.img_url}
                    alt={product.producto}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <h2 className="text-gray-300 text-sm font-medium line-clamp-2 group-hover:text-white transition-colors min-h-[40px]">
                    {product.producto}
                </h2>
              </Link>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-baseline gap-1">
                    <span className="text-emerald-500 text-xs font-bold">$</span>
                    <span className="text-2xl font-black text-white tracking-tighter">
                 {product.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

                    </span>
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                  <ShoppingCart size={18} />
                  <span className="text-sm">Comprar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
