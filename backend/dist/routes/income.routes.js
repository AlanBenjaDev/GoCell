"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const income_controller_1 = require("../controllers/income.controller");
const token_1 = require("../middlewares/token");
const express_1 = require("express");
const incomeRouter = (0, express_1.Router)();
incomeRouter.put('/update/:id', token_1.autenticarToken, income_controller_1.updateIncome);
incomeRouter.delete('/delete/:id', token_1.autenticarToken, income_controller_1.deleteIncome);
exports.default = incomeRouter;
