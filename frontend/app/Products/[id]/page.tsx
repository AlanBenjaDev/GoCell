"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
}

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: "es-AR" });
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/products/products/${id}`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-900/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return <div className="bg-black min-h-screen text-white p-10">Producto no encontrado.</div>;

  const agregarAlCarrito = async (producto_id: number) => {
    if (!token) {
      toast.error("Iniciá sesión para comprar", { style: { background: '#1a1a1a', color: '#fff' } });
      return;
    }
    const res = await fetch(`http://localhost:4000/cart/add/${producto_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ producto_id, cantidad: 1 }),
    });

    if (res.ok) toast.success("Agregado al carrito 🚀");
    else toast.error("Error al agregar");
  };

  const handleCreatePreference = async () => {
    try {
      const res = await fetch("http://localhost:4000/payments/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: product.producto, unit_price: product.precio, quantity: 1 }),
      });
      const data = await res.json();
      setPreferenceId(data.preferenceId);
    } catch (err) {
      toast.error("Error con Mercado Pago");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <div className="relative bg-[#0a0a0a] border border-emerald-900/20 rounded-3xl p-8 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50" />
          <img
            src={product.img_url}
            alt={product.producto}
            className="w-full max-h-[500px] object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(16,185,129,0.2)]"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-emerald-500 font-bold text-sm tracking-[0.2em] uppercase mb-2">Nuevo Lanzamiento</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{product.producto}</h1>
          
          <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-2 border-emerald-900/50 pl-6 italic">
            "{product.descripcion}"
          </p>

          <div className="bg-[#0a0a0a] border border-emerald-900/30 rounded-2xl p-6 mb-8">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-emerald-500 text-xl font-bold">$</span>
              <span className="text-5xl font-black tracking-tighter">
                {product.precio.toLocaleString('es-AR')}
              </span>
            </div>
            
            {product.precio > 15000 && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mt-2">
                <Truck size={18} /> ¡Envío gratis a todo cordoba!

              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleCreatePreference}
              disabled={loading}
              className="w-full bg-[#009ee3] hover:bg-[#0087c1] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/10"
            >
              {loading ? "Procesando..." : "Pagar con Mercado Pago"}
            </button>

            <button
              onClick={() => agregarAlCarrito(product.id)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ShoppingCart size={20} /> AGREGAR AL CARRITO
            </button>

            {preferenceId && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <Wallet initialization={{ preferenceId }} />
              </div>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-emerald-900/20 pt-8">
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              <ShieldCheck className="text-emerald-500" />
              <span>Garantía oficial de 3 meses</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              <Truck className="text-emerald-500" />
              <span>Despacho en menos de 24hs</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
