"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const db_1 = __importDefault(require("../config/db"));
const dashboardService = async () => {
    const [rows] = await db_1.default.query(`SELECT 
    e.id AS envio_id,
    e.tipo_envio,
    e.direccion,
    e.ciudad,
    e.codigo_postal,
    e.estado AS envio_estado,
    e.created_at AS fecha_envio,
    ped.id AS pedido_id,
    prod.nombre AS producto_nombre,
    prod.precio AS producto_precio,
    ped.total AS total_pedido,
    ped.estado AS estado_pedido
  FROM envios e
  JOIN pedidos ped ON ped.id = e.pedido_id
  JOIN productos prod ON prod.id = ped.producto_id
  ORDER BY e.created_at DESC;
  `);
    return rows;
};
exports.dashboardService = dashboardService;
