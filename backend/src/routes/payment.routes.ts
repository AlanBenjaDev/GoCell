import { Router } from "express";
import { createPreferenceController } from "../controllers/payment.controller";

const router = Router();

router.post("/create-preference", createPreferenceController);

export default router;
