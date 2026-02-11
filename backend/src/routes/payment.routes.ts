import { Router } from "express";
import { createPreferenceController } from "../controllers/payment.controller";
import { checkoutController } from "../controllers/payment.controller";
import { autenticarToken } from "../middlewares/token";



const router = Router();

router.post("/checkout", autenticarToken, checkoutController);


export default router;
