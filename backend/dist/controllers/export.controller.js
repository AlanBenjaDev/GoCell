"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportExcelController = void 0;
const export_service_1 = require("../services/export.service");
const exportExcelController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.exportData = await (0, export_service_1.exportExcelService)(userId);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.exportExcelController = exportExcelController;
