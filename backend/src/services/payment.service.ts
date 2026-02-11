import { Preference } from "mercadopago";
import { mpClient } from "../config/mp";
import { productosRepo } from "../repositories/products";
import { pedidosRepo } from "../repositories/pedidos";
import { enviosRepo } from "../repositories/envios";

import dotenv from "dotenv";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "";

const BACKEND_URL = process.env.BACKEND_URL || "";

interface CreatePreferenceDTO {
  title: string;
  unit_price: number;
  quantity: number;
  pedidoId?: number; 
}

export const createPreferenceService = async ({
  title,
  unit_price,
  quantity,
  pedidoId
}: CreatePreferenceDTO) => {

  if (!pedidoId) {
    throw new Error("pedidoId es obligatorio");
  }

  const preference = new Preference(mpClient);

  const response = await preference.create({
    body: {
      items: [
        {
          id: String(pedidoId),
          title,
          unit_price,
          quantity,
          currency_id: "ARS"
        }
      ],
      external_reference: String(pedidoId),
      back_urls: {
        success: `${FRONTEND_URL}/success`,
        failure: `${FRONTEND_URL}/failure`,
        pending: `${FRONTEND_URL}/pending`
      },
      notification_url: `${BACKEND_URL}/api/webhook/mercadopago`
    }
  });

  return response.id;
};


export const checkoutService = async ({
  userId,
  product_id,
  quantity,
  envio
}: any) => {

  const producto = await productosRepo.findById(product_id);
  if (!producto) throw new Error("Producto no existe");

  const total = producto.precio * quantity;

  const pedido = await pedidosRepo.create({
    usuarioId: userId,
    total,
    estado: "pendiente_pago"
  });

  await enviosRepo.create({
    pedido_id: pedido.id,
    ciudad: envio.ciudad,
    direccion: envio.direccion,
    codigo_postal: envio.codigo_postal,
    tipo_envio: envio.tipo_envio
  });

  const preferenceId = await createPreferenceService({
    title: producto.nombre,
    unit_price: producto.precio,
    quantity,
    pedidoId: pedido.id 
  });

  await pedidosRepo.update(pedido.id, {
    preference_id: preferenceId
  });

  return { preferenceId };
};