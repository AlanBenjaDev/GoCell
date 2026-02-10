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
  Box
} from "lucide-react";

// Estructura basada en tu Tabla 'envios' de SQL
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
}

export default function AdminDashboard() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SIMULACIÓN DE DATOS (MOCK)
    const datosSimulados: Envio[] = [
      {
        id: 1,
        pedido_id: 1024,
        tipo_envio: 'moto',
        direccion: 'Av. Corrientes 1234',
        ciudad: 'CABA',
        codigo_postal: '1425',
        tracking_codigo: 'MOT-9921',
        estado: 'en_camino',
        created_at: '2024-03-20T10:30:00Z'
      },
      {
        id: 2,
        pedido_id: 1025,
        tipo_envio: 'correo',
        direccion: 'Calle Falsa 123',
        ciudad: 'Córdoba',
        codigo_postal: '5000',
        tracking_codigo: 'AR-882211',
        estado: 'preparando',
        created_at: '2024-03-20T11:15:00Z'
      },
      {
        id: 3,
        pedido_id: 1026,
        tipo_envio: 'retiro_local',
        direccion: null,
        ciudad: null,
        codigo_postal: null,
        tracking_codigo: null,
        estado: 'entregado',
        created_at: '2024-03-19T15:00:00Z'
      }
    ];

    /* 
    ============================================================
    ESPACIO PARA FETCH REAL (DESCOMENTAR CUANDO ESTÉ EL BACKEND)
    ============================================================
    const fetchPedidos = async () => {
      try {
        const res = await fetch('http://localhost:4000/admin/envios', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const data = await res.json();
        setEnvios(data);
      } catch (err) {
        console.error("Error al traer envíos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
    */

    setEnvios(datosSimulados);
    setLoading(false);
  }, []);

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
        
        {/* HEADER DEL PANEL */}
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

        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <MetricCard icon={<Clock size={20}/>} label="Pendientes" value="12" color="emerald" />
          <MetricCard icon={<Truck size={20}/>} label="En Camino" value="05" color="emerald" />
          <MetricCard icon={<CheckCircle size={20}/>} label="Entregados" value="148" color="emerald" />
          <MetricCard icon={<TrendingUp size={20}/>} label="Ingresos Hoy" value="$450.000" color="emerald" />
        </div>

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
              />
            </div>
          </div>

          <div className="overflow-x-auto">
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
                {envios.map((envio) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Interno para las métricas
function MetricCard({ icon, label, value, color }: any) {
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
