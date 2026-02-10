"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportExcelService = void 0;
const db_1 = __importDefault(require("../config/db"));
const exportExcelService = async (userId) => {
    const [rows] = await db_1.default.query(`
    SELECT
      i.date        AS Fecha,
      'Ingreso'     AS Tipo,
      c.name        AS Categoria,
      i.amount      AS Monto,
      i.description AS Descripcion
    FROM incomes i
    LEFT JOIN categories c ON i.category_id = c.id
    WHERE i.user_id = ?

    UNION ALL

    SELECT
      e.date        AS Fecha,
      'Gasto'       AS Tipo,
      c.name        AS Categoria,
      e.amount      AS Monto,
      e.description AS Descripcion
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.user_id = ?

    ORDER BY 1 ASC
    `, [userId, userId]);
    return rows;
};
exports.exportExcelService = exportExcelService;
