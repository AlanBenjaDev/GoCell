"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const export_controller_1 = require("../controllers/export.controller");
const express_1 = require("express");
const export_middleware_1 = require("../middlewares/export.middleware");
const token_1 = require("../middlewares/token");
const exportRouter = (0, express_1.Router)();
exportRouter.get("/excel", token_1.autenticarToken, export_controller_1.exportExcelController, export_middleware_1.exportToExcel);
exports.default = exportRouter;
