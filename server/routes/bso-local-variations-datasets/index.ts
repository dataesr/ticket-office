import { Elysia } from "elysia"

import getBsoLocalVariationsDatasetsRoute from "./get"
import getBsoLocalVariationsDatasetsByIdRoute from "./get_id"
import patchBsoLocalVariationsDatasetsRoute from "./patch"
import patchBsoLocalVariationsDatasetsByIdRoute from "./patch_id"
import postBsoLocalVariationsDatasetsRoute from "./post"

export const bsoLocalVariationsDatasetsRoutes = new Elysia()

bsoLocalVariationsDatasetsRoutes.use(getBsoLocalVariationsDatasetsRoute);
bsoLocalVariationsDatasetsRoutes.use(getBsoLocalVariationsDatasetsByIdRoute);
bsoLocalVariationsDatasetsRoutes.use(patchBsoLocalVariationsDatasetsRoute);
bsoLocalVariationsDatasetsRoutes.use(patchBsoLocalVariationsDatasetsByIdRoute);
bsoLocalVariationsDatasetsRoutes.use(postBsoLocalVariationsDatasetsRoute);

export default bsoLocalVariationsDatasetsRoutes;
