"use client";

import { Search, ShoppingCart, LayoutDashboard, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link"; 

export default function Header() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("user");

  if (token && storedUser && storedUser !== "undefined") {
    try {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setIsAdmin(user.role === "admin");
    } catch (error) {
      console.error("Error al parsear user:", error);
    }
  }
}, []);


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) window.location.href = `/search?q=${query}`;
  };

  return (
    <header className="bg-[#051101] border-b border-emerald-900/30 sticky top-0 z-50">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-4 gap-4 md:gap-0">
        
        <Link href="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600 hover:opacity-80 transition-opacity">
         GO CELL
        </Link>

        <form onSubmit={handleSearch} className="flex w-full md:max-w-md items-center group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tecnología..."
            className="flex grow px-4 py-2 bg-neutral-900 text-white placeholder-gray-600 border border-emerald-900/50 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-r-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] active:scale-95"
          >
            <Search className="h-5 w-5 stroke-[3px]" />
          </button>
        </form>

        <div className="flex items-center gap-4 text-gray-400 text-sm font-bold">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link 
                  href="/Dashboard" 
                  className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full hover:bg-emerald-500 hover:text-black transition-all text-[10px] uppercase tracking-widest"
                >
                  <LayoutDashboard size={14} />
                  Panel Dueño
                </Link>
              )}
               {isAdmin && (
                <Link 
                  href="/Subir" 
                  className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full hover:bg-emerald-500 hover:text-black transition-all text-[10px] uppercase tracking-widest"
                >
                  <LayoutDashboard size={14} />
                 Agregar producto
                </Link>
              )}


              <Link href="/Carrito" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                <ShoppingCart size={20} />
                <span className="hidden md:inline">Carrito</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-400/70 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/Login" className="hover:text-emerald-400 transition-colors uppercase text-xs tracking-widest">
                Ingresá
              </Link>
              <Link href="/Register" className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest text-white">
                Registrate
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav className="bg-black/50 backdrop-blur-md border-t border-emerald-900/10">
        <div className="flex overflow-x-auto max-w-7xl mx-auto px-4 py-3 gap-8 no-scrollbar justify-center">
          {["Celulares", "Auriculares", "Cargadores", "Accesorios", "Ofertas"].map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="whitespace-nowrap text-[11px] text-gray-500 uppercase tracking-[0.2em] font-black hover:text-emerald-400 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
