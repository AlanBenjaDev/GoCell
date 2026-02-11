"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, UserPlus } from "lucide-react";

type FormData = {
  user: string;
  email: string;
  password: string;
};

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("¡Cuenta creada!", {
          description: "Ya podés ingresar a MiEcommerce.",
          style: { background: '#051101', color: '#10b981', border: '1px solid #064e3b' }
        });
        router.push("/Login");
      } else {
        toast.error(result.error || "Error al registrar");
      }
    } catch (error) {
      toast.error("Error de conexión", {
        description: "Intentalo de nuevo más tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/10 rounded-full blur-[120px]" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-[#0a0a0a] border border-emerald-900/30 rounded-3xl shadow-2xl z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <UserPlus className="text-emerald-500" size={24} />
          </div>
          <h1 className="text-white font-black text-3xl tracking-tight mb-2 text-center">
            Crear <span className="text-emerald-500 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Cuenta</span>
          </h1>
          <p className="text-gray-500 text-sm text-center">Unite a la comunidad tech líder</p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="text"
                {...register("user", { required: "El usuario es obligatorio" })}
                className="w-full bg-neutral-900/50 border border-emerald-900/20 p-3 pl-10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                placeholder="alan_tech"
              />
            </div>
            {errors.user && <p className="text-red-400 text-[10px] font-bold uppercase mt-1">{errors.user.message}</p>}
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70 ml-1">Email corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="email"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: { value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, message: "Email no válido" },
                })}
                className="w-full bg-neutral-900/50 border border-emerald-900/20 p-3 pl-10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && <p className="text-red-400 text-[10px] font-bold uppercase mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
                })}
                className="w-full bg-neutral-900/50 border border-emerald-900/20 p-3 pl-10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-400 text-[10px] font-bold uppercase mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-900/50 text-black py-4 rounded-xl transition-all font-black text-sm uppercase tracking-widest mt-6 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Confirmar Registro"
            )}
          </button>
        </div>

        <div className="text-center mt-10 pt-6 border-t border-emerald-900/10">
          <p className="text-xs text-gray-500 tracking-wide font-medium">
            ¿YA TENÉS CUENTA?{" "}
            <a href="/Login" className="text-emerald-500 font-black hover:text-emerald-400 underline-offset-4 hover:underline transition-all">
              INICIÁ SESIÓN
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
