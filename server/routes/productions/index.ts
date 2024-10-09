import getProductionsRoutes from "./get";
import getProductionByIdRoutes from "./get:id";
import postProductionRoutes from "./post";
import productionsPutRoutes from "./patch";

import { Elysia } from "elysia";

export const productionsRoutes = new Elysia();

productionsRoutes.use(getProductionsRoutes);
productionsRoutes.use(getProductionByIdRoutes);
productionsRoutes.use(postProductionRoutes);
productionsRoutes.use(productionsPutRoutes);

export default productionsRoutes;
