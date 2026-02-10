"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsByDateRangeController = exports.getBalance = exports.getTransactions = exports.createTransaction = void 0;
const expense_service_1 = require("../services/expense.service");
const income_service_1 = require("../services/income.service");
const transaction_service_1 = require("../services/transaction.service");
const createTransaction = async (req, res) => {
    const { amount, description, category, type } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("datos llegados al controller", amount, description, category, type, userId);
    if (type === "income") {
        console.log("datos llegando al service", amount, description, category, type, userId);
        const income = await (0, income_service_1.createIncomeService)({
            amount,
            description,
            category,
            userId,
        });
        return res.status(201).json({ data: income });
    }
    if (type === "expense") {
        console.log("datos llegando al service", amount, description, category, type, userId);
        const expense = await (0, expense_service_1.createExpenseService)({
            amount,
            description,
            category,
            userId,
        });
        return res.status(201).json({ data: expense });
    }
    return res.status(400).json({ message: "Invalid transaction type" });
};
exports.createTransaction = createTransaction;
const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const transactions = await (0, transaction_service_1.getTransactionsService)(userId);
        return res.status(200).json({ data: transactions });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching transactions" });
    }
};
exports.getTransactions = getTransactions;
const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const balance = await (0, transaction_service_1.getBalanceService)(userId);
        return res.status(200).json(balance);
    }
    catch {
        return res.status(500).json({ message: "Error fetching balance" });
    }
};
exports.getBalance = getBalance;
const getTransactionsByDateRangeController = async (req, res) => {
    try {
        const { from, to } = req.query;
        const userId = (Number(req.user?.id));
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!from || !to) {
            return res.status(400).json({
                message: "Tenés  que enviar una fecha valida.",
            });
        }
        const data = await (0, transaction_service_1.getTransactionsByDateRange)(userId, from, to);
        return res.status(200).json({
            data: data
        });
    }
    catch (error) {
        console.log("This error is", error);
        return res.status(500).json({
            error: "Internal server error."
        });
        return;
    }
};
exports.getTransactionsByDateRangeController = getTransactionsByDateRangeController;
