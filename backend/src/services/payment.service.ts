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
