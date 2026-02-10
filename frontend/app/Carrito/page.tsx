"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Carrito } from "./utils";
import { calcularTotal } from "./utils";
import Link from "next/link";
import { ShoppingBag, Trash2, ShieldCheck, Truck, ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";


initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || "", { locale: "es-AR" });

export default function CarritoList() {
  const [carrito, setCarrito] = useState<Carrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false); 
  const [token, setToken] = useState<string | null>(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      setToken(storedToken);
      setIsTokenChecked(true);
    }
  }, []);

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!token || !API_URL) return; 
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/cart/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar");
        const data = await res.json();
        setCarrito(data);
      } catch (err) {
        toast.error("No pudimos sincronizar tu carrito");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token, API_URL]);

  const handleCreatePreference = async () => {
    if (carrito.length === 0) return;
    setPaying(true);

    try {
      const res = await fetch(`${API_URL}/payments/create-preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Compra en Go Cell Tech",
          unit_price: calcularTotal(carrito),
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Error en servidor de pagos");

      const data = await res.json();
      setPreferenceId(data.preferenceId);
    } catch (err) {
      console.error(err);
      toast.error("Error al generar el pago");
    } finally {
      setPaying(false);
    }
  };

  if (!isTokenChecked || loading) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-900/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
      </main>
    );
  }

  if (carrito.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag size={80} className="text-emerald-900/40 mb-6" />
        <h1 className="text-3xl font-black mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">¿Buscas tecnología? Tenemos los mejores precios.</p>
        <Link href="/Products" className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all">
          Ir a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/Products" className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-emerald-500">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-4xl font-black tracking-tight">Tu <span className="text-emerald-500">Carrito</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {carrito.map((cart) => (
              <div key={cart.id} className="bg-[#0a0a0a] border border-emerald-900/20 p-4 md:p-6 rounded-3xl flex items-center gap-6 hover:border-emerald-500/30 transition-all group">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-900 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={cart.img_url} alt={cart.producto} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg md:text-xl font-bold text-gray-200 line-clamp-1">{cart.producto}</h2>
                    <button className="text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-emerald-500 font-black text-xl mt-1">${cart.precio.toLocaleString('es-AR')}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cantidad: {cart.cantidad}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-3xl p-8 sticky top-24 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
              <h2 className="text-xl font-black mb-6 border-b border-emerald-900/30 pb-4">Resumen</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Productos ({carrito.length})</span>
                  <span>${calcularTotal(carrito).toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="h-[1px] bg-emerald-900/30 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white tracking-tighter">
                      ${calcularTotal(carrito).toLocaleString('es-AR')}
                    </p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase">IVA Incluido</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {!preferenceId ? (
                  <button
                    onClick={handleCreatePreference}
                    disabled={paying}
                    className="group w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-900/50 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.2)] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Generando Pago...
                      </>
                    ) : (
                      "Pagar con Mercado Pago"
                    )}
                  </button>
                ) : (
                  <div className="animate-in fade-in zoom-in duration-500">
                    <Wallet initialization={{ preferenceId }} />
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>Compra Protegida por Go Cell</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Truck size={16} className="text-emerald-500" />
                  <span>Recibilo mañana en tu casa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
