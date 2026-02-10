"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferenceService = void 0;
const mercadopago_1 = require("mercadopago");
const mp_1 = require("../config/mp");
const createPreferenceService = async ({ title, unit_price, quantity }) => {
    const preference = new mercadopago_1.Preference(mp_1.mpClient);
    const response = await preference.create({
        body: {
            items: [{ id: title, title, unit_price, quantity }],
            back_urls: {
                success: "http://localhost:4000/success",
                failure: "http://localhost:4000/failure",
                pending: "http://localhost:4000/pending"
            },
            auto_return: "approved", // redirige automáticamente al success
            binary_mode: true // opcional: solo pago aprobado o rechazado
        }
    });
    return response.id;
};
exports.createPreferenceService = createPreferenceService;
