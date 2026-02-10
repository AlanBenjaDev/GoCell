"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpensesService = exports.updateExpenseService = exports.getExpenseService = exports.createExpenseService = void 0;
const db_1 = __importDefault(require("../config/db"));
const category_service_1 = require("./category.service");
const createExpenseService = async (data) => {
    const { amount, description, category, userId } = data;
    const categoryId = await (0, category_service_1.getOrCreateCategory)({
        name: category,
        type: "expense",
        userId,
    });
    const [result] = await db_1.default.query(`
    INSERT INTO expenses (amount, description, category_id, user_id)
    VALUES (?, ?, ?, ?)
    `, [amount, description || null, categoryId, userId]);
    const [rows] = await db_1.default.query(`
    SELECT id, amount, description, date, category_id, user_id
    FROM expenses
    WHERE id = ? AND user_id = ?
    `, [result.insertId, userId]);
    const expense = rows[0];
    return {
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        category: expense.category_id,
        userId: expense.user_id,
    };
};
exports.createExpenseService = createExpenseService;
const getExpenseService = async () => {
    const query = `SELECT  id,amount,description,date,category_id
  FROM expenses`;
    const params = [];
    const [rows] = await db_1.default.query(query, params);
    return rows;
};
exports.getExpenseService = getExpenseService;
const updateExpenseService = async (data) => {
    const { id, amount, description, categoryId, userId } = data;
    return db_1.default.query(`
    UPDATE expenses
    SET amount = ?, description = ?, category_id = ?
    WHERE id = ? AND user_id = ?
    `, [amount, description || null, categoryId, id, userId]);
};
exports.updateExpenseService = updateExpenseService;
const deleteExpensesService = async (id, userId) => {
    return db_1.default.query(`
    DELETE FROM expenses
    WHERE id = ? AND user_id = ?
    `, [id, userId]);
};
exports.deleteExpensesService = deleteExpensesService;
