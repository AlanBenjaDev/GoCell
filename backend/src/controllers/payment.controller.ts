import { Request, Response } from "express";
import { createPreferenceService } from "../services/payment.service";

export const createPreferenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, unit_price, quantity } = req.body;

    if (!title || !unit_price || !quantity) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const preferenceId = await createPreferenceService({
      title,
      unit_price: Number(unit_price),
      quantity: Number(quantity)
    });

    res.json({ preferenceId });

  } catch (error: any) {
    console.error("Error MercadoPago:", error);
    res.status(500).json({ message: "Error creando preferencia" });
  }
};
