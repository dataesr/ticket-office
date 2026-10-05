import getProductionsRoutes from "./get";
import getProductionByIdRoutes from "./get_id";
import postProductionRoutes from "./post";
import productionsPutRoutes from "./patch";

import { Elysia } from "elysia";

export const productionsRoutes = new Elysia()
  .use(getProductionsRoutes)
  .use(getProductionByIdRoutes)
  .use(postProductionRoutes)
  .use(productionsPutRoutes);

export default productionsRoutes;
