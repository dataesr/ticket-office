import getVariationsRoute from "./get"
import getVariationByIdRoute from "./get_id"
import patchVariationsRoute from "./patch"
import patchVariationByIdRoute from "./patch_id"
import postVariationRoute from "./post"

import { Elysia } from "elysia"

export const variationsRoutes = new Elysia()

variationsRoutes.use(getVariationsRoute)
variationsRoutes.use(getVariationByIdRoute)
variationsRoutes.use(patchVariationsRoute)
variationsRoutes.use(patchVariationByIdRoute)
variationsRoutes.use(postVariationRoute)

export default variationsRoutes
