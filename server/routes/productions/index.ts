import getProductionsRoutes from "./get";
import getProductionByIdRoutes from "./get_id";
import productionsPutRoutes from "./patch";
import postProductionRoutes from "./post";

import { Elysia } from "elysia";

export const productionsRoutes = new Elysia()
  .use(getProductionsRoutes)
  .use(getProductionByIdRoutes)
  .use(postProductionRoutes)
  .use(productionsPutRoutes);

export default productionsRoutes;
