import { Elysia } from "elysia"

import getBsoLocalVariationsPublicationsRoute from "./get"
import getBsoLocalVariationsPublicationsByIdRoute from "./get_id"
import patchBsoLocalVariationsPublicationsRoute from "./patch"
import patchBsoLocalVariationsPublicationsByIdRoute from "./patch_id"
import postBsoLocalVariationsPublicationsRoute from "./post"

export const bsoLocalVariationsPublicationsRoutes = new Elysia()

bsoLocalVariationsPublicationsRoutes.use(getBsoLocalVariationsPublicationsRoute)
bsoLocalVariationsPublicationsRoutes.use(getBsoLocalVariationsPublicationsByIdRoute)
bsoLocalVariationsPublicationsRoutes.use(patchBsoLocalVariationsPublicationsRoute)
bsoLocalVariationsPublicationsRoutes.use(patchBsoLocalVariationsPublicationsByIdRoute)
bsoLocalVariationsPublicationsRoutes.use(postBsoLocalVariationsPublicationsRoute)

export default bsoLocalVariationsPublicationsRoutes
