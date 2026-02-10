"use client";
import { useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

export default function FileUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file); 
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    // Podés resetear el input si es necesario
  };

  return (
    <div className="flex flex-col items-center justify-center w-full group">
      {!preview ? (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-emerald-900/30 rounded-3xl cursor-pointer bg-neutral-900/50 hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all duration-300 shadow-inner"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-3 bg-emerald-500/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="mb-1 text-sm text-gray-300 tracking-tight">
              <span className="font-bold text-emerald-400">Cargar imagen</span> del producto
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              PNG, JPG o WEBP (máx. 5MB)
            </p>
          </div>
          <input
  id="file-upload"
  name="imagen"              
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleFileChange}
/>

        </label>
      ) : (
        /* Vista previa con estilo de celda de energía */
        <div className="relative w-full h-48 bg-neutral-900 rounded-3xl border border-emerald-500/30 overflow-hidden group">
          <img 
            src={preview} 
            alt="Vista previa" 
            className="w-full h-full object-contain p-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
          />
          
          {/* Overlay de edición */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button 
              onClick={removeImage}
              className="p-3 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
              title="Eliminar imagen"
            >
              <X size={20} />
            </button>
            <label htmlFor="file-upload" className="p-3 bg-emerald-500/20 text-emerald-500 rounded-full hover:bg-emerald-500 hover:text-black cursor-pointer transition-all">
               <ImageIcon size={20} />
               <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div className="absolute bottom-2 right-4">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest opacity-50">Image Ready</span>
          </div>
        </div>
      )}
    </div>
  );
}
