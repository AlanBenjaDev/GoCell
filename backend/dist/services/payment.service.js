"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferenceService = void 0;
const mercadopago_1 = require("mercadopago");
const mp_1 = require("../config/mp");
const createPreferenceService = async ({ title, unit_price, quantity }) => {
    const preference = new mercadopago_1.Preference(mp_1.mpClient);
    const response = await preference.create({
        body: {
            items: [
                {
                    id: title,
                    title,
                    unit_price,
                    quantity,
                    currency_id: "ARS"
                }
            ],
            back_urls: {
                success: "https://go-cell-racf.vercel.app/success",
                failure: "https://go-cell-racf.vercel.app/failure",
                pending: "https://go-cell-racf.vercel.app/pending"
            }
        }
    });
    return response.id;
};
exports.createPreferenceService = createPreferenceService;
