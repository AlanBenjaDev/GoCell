"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferenceController = void 0;
const payment_service_1 = require("../services/payment.service");
const createPreferenceController = async (req, res) => {
    try {
        const { title, unit_price, quantity } = req.body;
        if (!title || !unit_price || !quantity) {
            return res.status(400).json({ message: "Datos inválidos" });
        }
        const preferenceId = await (0, payment_service_1.createPreferenceService)({
            title,
            unit_price: Number(unit_price),
            quantity: Number(quantity)
        });
        res.json({ preferenceId });
    }
    catch (error) {
        console.error("Error MercadoPago:", error);
        res.status(500).json({ message: "Error creando preferencia" });
    }
};
exports.createPreferenceController = createPreferenceController;
