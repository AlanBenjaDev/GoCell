"use client";
import React, { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Search,
  TrendingUp
} from "lucide-react";

interface Envio {
  id: number;
  pedido_id: number;
  tipo_envio: 'retiro_local' | 'moto' | 'correo';
  direccion: string | null;
  ciudad: string | null;
  codigo_postal: string | null;
  tracking_codigo: string | null;
  estado: 'preparando' | 'en_camino' | 'entregado';
  created_at: string;
  producto_nombre?: string;
  producto_precio?: number;
  total_pedido?: number;
}

export default function AdminDashboard() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/payments/dashboard`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        if (!res.ok) throw new Error("Error al obtener envíos");
        const data = await res.json();
        setEnvios(data);
      } catch (err) {
        console.error("Error al traer envíos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [API_URL]);

  // Filtrado de envíos por búsqueda
  const filteredEnvios = envios.filter(e =>
    e.pedido_id.toString().includes(search) ||
    (e.tracking_codigo || '').includes(search)
  );

  const getStatusColor = (estado: string) => {
    switch(estado) {
      case 'preparando': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'en_camino': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'entregado': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Gestión de <span className="text-emerald-500">Envíos</span></h1>
            <p className="text-gray-500 text-sm">Panel de control de logística Go Cell</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl font-bold text-xs transition-all">
              + NUEVO PRODUCTO
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <MetricCard icon={<Clock />} label="Pendientes" value="12" />
          <MetricCard icon={<Truck />} label="En Camino" value="05" />
          <MetricCard icon={<CheckCircle />} label="Entregados" value="148" />
          <MetricCard icon={<TrendingUp />} label="Ingresos Hoy" value="$450.000" />
        </div>

        {/* Tabla de envíos */}
        <div className="bg-[#0a0a0a] border border-emerald-900/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-emerald-900/10 flex justify-between items-center bg-emerald-900/5">
            <h2 className="font-bold flex items-center gap-2 text-emerald-500">
              <Package size={18} /> Últimos Envíos
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
              <input 
                type="text" 
                placeholder="Buscar ID o Tracking..." 
                className="bg-black border border-emerald-900/30 rounded-lg py-1.5 pl-9 pr-4 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-gray-400 text-sm p-4">Cargando envíos...</p>
            ) : filteredEnvios.length === 0 ? (
              <p className="text-gray-400 text-sm p-4">No hay envíos registrados</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 border-b border-emerald-900/10">
                    <th className="px-6 py-4 font-black">ID Pedido</th>
                    <th className="px-6 py-4 font-black">Tipo</th>
                    <th className="px-6 py-4 font-black">Destino</th>
                    <th className="px-6 py-4 font-black">Tracking</th>
                    <th className="px-6 py-4 font-black">Estado</th>
                    <th className="px-6 py-4 font-black text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/10">
                  {filteredEnvios.map((envio) => (
                    <tr key={envio.id} className="hover:bg-emerald-500/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-emerald-500">#{envio.pedido_id}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400 capitalize">{envio.tipo_envio.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          <span className="text-gray-200">{envio.direccion || 'Retiro Presencial'}</span>
                          <span className="text-gray-500">{envio.ciudad || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                        {envio.tracking_codigo || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-md border font-black uppercase tracking-tighter ${getStatusColor(envio.estado)}`}>
                          {envio.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-600 group-hover:text-emerald-500 transition-colors">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-emerald-900/20 p-6 rounded-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500">
        {React.cloneElement(icon, { size: 40 })}
      </div>
      <div className="text-emerald-500 mb-2">{icon}</div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black mt-1 text-white">{value}</h3>
    </div>
  );
}
