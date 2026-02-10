import { createProductController,getProductsController,getProductsByIdController, getProductosPorCategoria } from "../controllers/product.controller";
import { Router } from "express";
import { autenticarToken } from "../middlewares/token";
import { authorizeRoles, RoleEstatus } from "../middlewares/roles";
import upload from "../middlewares/upload";
const productsRouter = Router();
import { Request,Response,NextFunction } from "express";

productsRouter.post(
  "/create/product",
  (req:Request, res:Response, next:NextFunction) => {
    console.log("REQ BEFORE MULTER:", req.body);
    next();
  },
  upload.single("imagen"),
  (err: any, req: any, res: any, next: any) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  },
  autenticarToken,
  authorizeRoles(RoleEstatus.admin),
  createProductController
);



productsRouter.get("/products", getProductsController);
productsRouter.get("/products/:id", getProductsByIdController);
productsRouter.get("/productos/:categoria", getProductosPorCategoria);
export default productsRouter;