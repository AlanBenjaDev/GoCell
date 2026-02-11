"use client";
import React, { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Search,
  TrendingUp,
  Loader2
} from "lucide-react";

// Interfaz exacta basada en tu Query SQL
interface DashboardData {
  envio_id: number;
  tipo_envio: 'retiro_local' | 'moto' | 'correo';
  direccion: string | null;
  ciudad: string | null;
  codigo_postal: string | null;
  envio_estado: 'preparando' | 'en_camino' | 'entregado';
  fecha_envio: string;
  pedido_id: number;
  producto_nombre: string;
  producto_precio: number;
  total_pedido: number;
  estado_pedido: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_URL}/payments/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Error en el servidor");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [API_URL]);

  // Lógica de métricas reales
  const pendientes = data.filter(e => e.envio_estado === 'preparando').length;
  const enCamino = data.filter(e => e.envio_estado === 'en_camino').length;
  const entregados = data.filter(e => e.envio_estado === 'entregado').length;
  const ingresosHoy = data
    .filter(e => new Date(e.fecha_envio).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + Number(curr.total_pedido), 0);

  const filteredEnvios = data.filter(e =>
    e.pedido_id.toString().includes(search) ||
    e.producto_nombre.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-3xl font-black tracking-tighter uppercase">Logística <span className="text-emerald-500">Go Cell</span></h1>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase opacity-60">Admin Control Panel</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl font-black text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            + CARGAR STOCK
          </button>
        </div>

        {/* Métricas Reales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <MetricCard icon={<Clock />} label="Preparando" value={pendientes} />
          <MetricCard icon={<Truck />} label="En Camino" value={enCamino} />
          <MetricCard icon={<CheckCircle />} label="Entregados" value={entregados} />
          <MetricCard icon={<TrendingUp />} label="Ingresos Hoy" value={`$${ingresosHoy.toLocaleString('es-AR')}`} />
        </div>

        {/* Tabla Real */}
        <div className="bg-[#0a0a0a] border border-emerald-900/20 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-emerald-900/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-emerald-900/5">
            <h2 className="font-black flex items-center gap-2 text-emerald-500 uppercase text-sm tracking-widest">
              <Package size={18} /> Monitor de Pedidos
            </h2>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/50" size={14} />
              <input 
                type="text" 
                placeholder="Buscar Pedido o Producto..." 
                className="w-full bg-black border border-emerald-900/30 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
              </div>
            ) : filteredEnvios.length === 0 ? (
              <div className="p-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                No se encontraron registros en la base de datos
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 border-b border-emerald-900/10">
                    <th className="px-8 py-5 font-black">ID / Producto</th>
                    <th className="px-8 py-5 font-black">Tipo Envío</th>
                    <th className="px-8 py-5 font-black">Destino</th>
                    <th className="px-8 py-5 font-black">Total</th>
                    <th className="px-8 py-5 font-black">Estado</th>
                    <th className="px-8 py-5 font-black text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/5">
                  {filteredEnvios.map((envio) => (
                    <tr key={envio.envio_id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-white text-sm">#{envio.pedido_id}</span>
                          <span className="text-[10px] text-gray-500 uppercase font-bold truncate max-w-[150px]">
                            {envio.producto_nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400 font-black uppercase tracking-tighter">
                          {envio.tipo_envio.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col text-[11px]">
                          <span className="text-gray-300 font-medium">{envio.direccion || 'Retiro Local'}</span>
                          <span className="text-gray-500 text-[9px] uppercase tracking-wider">{envio.ciudad || 'Go Cell Store'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-black text-emerald-500 text-sm">
                          ${Number(envio.total_pedido).toLocaleString('es-AR')}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] px-2 py-1 rounded-full border font-black uppercase tracking-widest ${getStatusColor(envio.envio_estado)}`}>
                          {envio.envio_estado}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-emerald-500 hover:text-black rounded-lg transition-all text-emerald-500">
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
    <div className="bg-[#0a0a0a] border border-emerald-900/20 p-6 rounded-[1.5rem] relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-emerald-500 rotate-12">
        {React.cloneElement(icon, { size: 80 })}
      </div>
      <div className="text-emerald-500 mb-4 bg-emerald-500/10 w-fit p-2 rounded-lg border border-emerald-500/20">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      <h3 className="text-2xl font-black mt-1 text-white tracking-tighter">{value}</h3>
    </div>
  );
}
