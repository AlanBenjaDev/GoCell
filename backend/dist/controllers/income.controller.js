"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncome = exports.updateIncome = void 0;
const income_service_1 = require("../services/income.service");
const updateIncome = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const { amount, description, category } = req.body;
        console.log(req.body);
        await (0, income_service_1.updateIncomeService)({
            id,
            amount,
            description,
            category,
            userId,
        });
        return res.status(200).json({
            message: "Successful updated",
        });
    }
    catch (error) {
        console.log("El error es", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.updateIncome = updateIncome;
const deleteIncome = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        await (0, income_service_1.deleteIncomeService)(id, userId);
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
exports.deleteIncome = deleteIncome;
