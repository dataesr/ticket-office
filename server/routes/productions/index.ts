import getProductionsRoutes from "./get";
import getProductionByIdRoutes from "./get:id";
import postProductionRoutes from "./post";
<<<<<<< HEAD
import productionsPutRoutes from "./patch";
=======
import productionsPutRoutes from "./put";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

import { Elysia } from "elysia";

export const productionsRoutes = new Elysia();

productionsRoutes.use(getProductionsRoutes);
productionsRoutes.use(getProductionByIdRoutes);
productionsRoutes.use(postProductionRoutes);
productionsRoutes.use(productionsPutRoutes);

export default productionsRoutes;
