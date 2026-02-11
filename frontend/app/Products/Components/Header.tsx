"use client";

import { ShoppingCart, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-[#051101] border-b border-emerald-900/30 sticky top-0 z-50">
      <div className="flex items-center justify-end max-w-7xl mx-auto px-4 py-4 gap-4">
        {isLoggedIn && (
          <>
            <Link
              href="/Carrito"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
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
        )}
      </div>
    </header>
  );
}
