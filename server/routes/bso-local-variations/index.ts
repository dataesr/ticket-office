import { Elysia } from "elysia"

import getBsoLocalVariationsPublicationsRoute from "./get"
import getBsoLocalVariationsPublicationsByIdRoute from "./get_id"
import patchBsoLocalVariationsPublicationsRoute from "./patch"
import patchBsoLocalVariationsPublicationsByIdRoute from "./patch_id"
import postBsoLocalVariationsPublicationsRoute from "./post"

export const bsoLocalVariationsPublicationsRoutes = new Elysia()
  .use(getBsoLocalVariationsPublicationsRoute)
  .use(getBsoLocalVariationsPublicationsByIdRoute)
  .use(patchBsoLocalVariationsPublicationsRoute)
  .use(patchBsoLocalVariationsPublicationsByIdRoute)
  .use(postBsoLocalVariationsPublicationsRoute)

export default bsoLocalVariationsPublicationsRoutes
