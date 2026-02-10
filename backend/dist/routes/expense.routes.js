"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_controller_1 = require("../controllers/expense.controller");
const token_1 = require("../middlewares/token");
const expenseRouter = (0, express_1.Router)();
expenseRouter.put('/update/:id', token_1.autenticarToken, expense_controller_1.updateExpense);
expenseRouter.delete('/delete/:id', token_1.autenticarToken, expense_controller_1.deleteExpense);
exports.default = expenseRouter;
