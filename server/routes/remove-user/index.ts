import getRemoveUserRoutes from "./get"
import getRemoveUserByIdRoutes from "./get_id"
import postRemoveUserRoutes from "./post"
import removeUserPutRoutes from "./patch"

import { Elysia } from "elysia"

export const removeUserRoutes = new Elysia()
  .use(getRemoveUserRoutes)
  .use(getRemoveUserByIdRoutes)
  .use(postRemoveUserRoutes)
  .use(removeUserPutRoutes)

export default removeUserRoutes
