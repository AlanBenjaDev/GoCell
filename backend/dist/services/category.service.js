"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCategory = void 0;
const db_1 = __importDefault(require("../config/db"));
const getOrCreateCategory = async ({ name, type, userId, }) => {
    const [rows] = await db_1.default.query(`
    SELECT id
    FROM categories
    WHERE name = ? AND type = ? AND user_id = ?
    `, [name, type, userId]);
    if (rows.length > 0) {
        return rows[0].id;
    }
    const [result] = await db_1.default.query(`
    INSERT INTO categories (name, type, user_id)
    VALUES (?, ?, ?)
    `, [name, type, userId]);
    return result.insertId;
};
exports.getOrCreateCategory = getOrCreateCategory;
