"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "./SubirProducto";
import { toast } from "sonner";
import { PackagePlus, DollarSign, Box, Layers, AlignLeft, Cpu } from "lucide-react";

export default function AddProduct() {
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
  if (!selectedFile) {
    toast.error("Debes cargar una imagen del producto");
    return;
  }

  setLoading(true);
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();

  // Coincidir los nombres con lo que espera Multer
  formData.append("producto", data.nombre);
  formData.append("descripcion", data.descripcion);
  formData.append("precio", data.precio);
  formData.append("stock", data.stock);
  formData.append("categoria", data.categoria);
 formData.append("imagen", selectedFile); // debe coincidir con upload.single("imagen")

  try {
    const res = await fetch("http://localhost:4000/products/create/product", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // solo el token, NO Content-Type
  },
  body: formData, // Multer detecta multipart/form-data automáticamente
});

    const result = await res.json();
    if (res.ok) {
      toast.success("¡Producto listado en Go Cell!", {
        style: { background: '#051101', color: '#10b981', border: '1px solid #064e3b' }
      });
      reset();
      setSelectedFile(null);
    } else {
      toast.error("Error en la carga", { description: JSON.stringify(result) });
    }
  } catch (err) {
    toast.error("Error de conexión con el servidor");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-8 bg-[#0a0a0a] rounded-[2rem] shadow-2xl flex flex-col gap-6 border border-emerald-900/30 relative overflow-hidden"
      >
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <PackagePlus className="text-emerald-500" size={28} />
          </div>
          <h1 className="text-white font-black text-3xl tracking-tighter">
            Nuevo <span className="text-emerald-500">Producto</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 flex items-center gap-2">
              <Cpu size={12} /> Nombre del Modelo
            </label>
            <input 
              {...register("nombre", { required: true })} 
              placeholder="Ej: iPhone 15 Pro Max" 
              className="bg-neutral-900 border border-emerald-900/20 p-3 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all" 
            />
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 flex items-center gap-2">
              <Layers size={12} /> Categoría Tech
            </label>
            <select 
              {...register("categoria")} 
              className="bg-neutral-900 border border-emerald-900/20 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/40 appearance-none cursor-pointer"
            >
              <option value="celulares">Celulares</option>
              <option value="auriculares">Auriculares</option>
              <option value="cargadores">Cargadores</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 flex items-center gap-2">
              <DollarSign size={12} /> Precio de Venta
            </label>
            <input 
              {...register("precio", { required: true })} 
              type="number" 
              placeholder="0.00" 
              className="bg-neutral-900 border border-emerald-900/20 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/40" 
            />
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 flex items-center gap-2">
              <Box size={12} /> Unidades Disponibles
            </label>
            <input 
              {...register("stock", { required: true })} 
              type="number" 
              placeholder="Cant." 
              className="bg-neutral-900 border border-emerald-900/20 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/40" 
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 flex items-center gap-2">
            <AlignLeft size={12} /> Especificaciones Técnicas
          </label>
          <textarea 
            {...register("descripcion")} 
            placeholder="Detalles del procesador, cámara, batería..." 
            rows={3}
            className="bg-neutral-900 border border-emerald-900/20 p-3 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/40 outline-none resize-none"
          />
        </div>

        {/* Imagen */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 mb-1">Galería de Producto</label>
          <div className="bg-neutral-900 border-2 border-dashed border-emerald-900/30 rounded-2xl p-4 hover:border-emerald-500/50 transition-colors">
            <FileUpload onFileSelect={setSelectedFile} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-900/50 text-black py-4 font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs mt-4"
        >
          {loading ? "Subiendo a Go Cell..." : "Publicar en la Tienda"}
        </button>
      </form>
    </div>
  );
}
