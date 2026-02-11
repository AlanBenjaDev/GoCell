"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Mail, Loader2 } from "lucide-react"; 



type FormData = {
  email: string; 
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), 
      });

      const result = await res.json();

      if (res.ok) {
          localStorage.setItem("accessToken", result.token);
  
  const userData = result.user  
  localStorage.setItem("user", JSON.stringify(userData));

   toast.success("¡Bienvenido de nuevo!", {
          description: "Acceso concedido correctamente.",
          style: { background: '#051101', color: '#10b981', border: '1px solid #064e3b' }
        });
        router.push("/Products");
  


      
      } else {
        toast.error("Credenciales inválidas", {
          description: "Revisá tu email o contraseña.",
        });
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-900/10 rounded-full blur-[120px]" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-[#0a0a0a] border border-emerald-900/30 rounded-3xl shadow-2xl z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-white font-black text-3xl tracking-tight mb-2">
             <span className="text-emerald-500">Iniciar Sesión</span>
          </h1>
          <p className="text-gray-500 text-sm">Ingresá a Go Cell</p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-500/70 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                {...register("email", { 
                  required: "El email es obligatorio",
                  pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
                })}
                className="w-full bg-neutral-900 border border-emerald-900/20 p-3 pl-10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                placeholder="alan@gotech.com"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-500/70 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                className="w-full bg-neutral-900 border border-emerald-900/20 p-3 pl-10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-900/50 text-black py-4 rounded-xl transition-all font-black text-sm uppercase tracking-widest mt-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Ingresar al sistema"
            )}
          </button>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-emerald-900/10">
          <p className="text-xs text-gray-500 tracking-wide">
            ¿NUEVO POR AQUÍ?{" "}
            <a href="/Register" className="text-emerald-500 font-bold hover:text-emerald-400 underline-offset-4 hover:underline transition-all">
              CREÁ TU CUENTA
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
