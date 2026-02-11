"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const token_1 = require("../middlewares/token");
const router = (0, express_1.Router)();
router.post("/checkout", token_1.autenticarToken, payment_controller_1.checkoutController);
exports.default = router;
