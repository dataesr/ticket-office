import getVariationsRoutes from "./get"
import getVariationByIdRoutes from "./get_id"
import postVariationRoutes from "./post"
import patchVariationRoutes from "./patch"

import { Elysia } from "elysia"

export const variationsRoutes = new Elysia()

variationsRoutes.use(getVariationsRoutes)
variationsRoutes.use(getVariationByIdRoutes)
variationsRoutes.use(postVariationRoutes)
variationsRoutes.use(patchVariationRoutes)

export default variationsRoutes
