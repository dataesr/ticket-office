import { Elysia } from "elysia"
import getTaskStatus from "./get_id"
import updateIndex from "./post"

export const bsoTasksRoutes = new Elysia()
  .use(getTaskStatus)
  .use(updateIndex)

export default bsoTasksRoutes
