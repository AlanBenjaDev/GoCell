"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsByDateRange = exports.getBalanceService = exports.getTransactionsService = void 0;
const db_1 = __importDefault(require("../config/db"));
const getTransactionsService = async (userId) => {
    const [rows] = await db_1.default.query(`
    SELECT 
      id,
      amount,
      description,
      category_id AS categoryId,
      'income' AS type,
      created_at
    FROM incomes
    WHERE user_id = ?

    UNION ALL

    SELECT 
      id,
      amount,
      description,
      category_id AS categoryId,
      'expense' AS type,
      created_at
    FROM expenses
    WHERE user_id = ?

    ORDER BY created_at DESC
    `, [userId, userId]);
    return rows;
};
exports.getTransactionsService = getTransactionsService;
const getBalanceService = async (userId) => {
    const [rows] = await db_1.default.query(`
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
    FROM (
      SELECT amount, 'income' AS type
      FROM incomes
      WHERE user_id = ?

      UNION ALL

      SELECT amount, 'expense' AS type
      FROM expenses
      WHERE user_id = ?
    ) t
    `, [userId, userId]);
    const totalIncome = rows[0].totalIncome || 0;
    const totalExpense = rows[0].totalExpense || 0;
    const balance = totalIncome - totalExpense;
    const percentage = totalIncome === 0
        ? 0
        : ((balance / totalIncome) * 100).toFixed(2);
    return {
        totalIncome,
        totalExpense,
        balance,
        percentage: Number(percentage),
        result: balance > 0 ? "profit" : balance < 0 ? "loss" : "neutral",
    };
};
exports.getBalanceService = getBalanceService;
const getTransactionsByDateRange = async (userId, from, to) => {
    const [rows] = await db_1.default.query(`
    SELECT 
      id,
      amount,
      description,
      category_id AS categoryId,
      created_at AS createdAt,
      'expense' AS type
    FROM expenses
    WHERE user_id = ?
      AND date >= ?
      AND date < ?

    UNION ALL

    SELECT 
      id,
      amount,
      description,
      category_id AS categoryId,
      created_at AS createdAt,
      'income' AS type
    FROM incomes
    WHERE user_id = ?
      AND date >= ?
      AND date < ?

    ORDER BY createdAt DESC;
    `, [userId, from, to, userId, from, to]);
    return rows;
};
exports.getTransactionsByDateRange = getTransactionsByDateRange;
