import { Preference } from "mercadopago";
import { mpClient } from "../config/mp";

interface CreatePreferenceDTO {
  title: string;
  unit_price: number;
  quantity: number;
}

export const createPreferenceService = async ({
  title,
  unit_price,
  quantity
}: CreatePreferenceDTO) => {

  const preference = new Preference(mpClient);

 const response = await preference.create({
  body: {
    items: [{ id: title, title, unit_price, quantity }],
    back_urls: {
      success: "http://localhost:4000/success",
      failure: "http://localhost:4000/failure",
      pending: "http://localhost:4000/pending"
    },
    auto_return: "approved", // redirige automáticamente al success
    binary_mode: true        // opcional: solo pago aprobado o rechazado
  }
});
    


  return response.id;
};
