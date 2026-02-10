"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = void 0;
const expense_service_1 = require("../services/expense.service");
const updateExpense = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        let { amount, description, categoryId } = req.body;
        // Convertir amount a número
        amount = Number(amount);
        if (isNaN(amount)) {
            return res.status(400).json({ message: "Amount inválido" });
        }
        // categoryId opcional → null si no viene
        categoryId = categoryId ?? null;
        await (0, expense_service_1.updateExpenseService)({
            id,
            amount,
            description,
            categoryId,
            userId,
        });
        return res.status(200).json({
            message: "Expense updated successfully",
        });
    }
    catch (error) {
        console.error("updateExpense error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user?.id;
        console.log("id llegando al controller", id);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        console.log("id llegando al  service", id);
        await (0, expense_service_1.deleteExpensesService)(id, userId);
        console.log("se esta por borrar", id);
        return res.status(200).json({
            message: "Successful delete expense.",
        });
    }
    catch (error) {
        console.log("El error es", error);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};
exports.deleteExpense = deleteExpense;
