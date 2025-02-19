import getStorageRoutes from "./get-file"

import { Elysia } from "elysia"

export const storageRoutes = new Elysia()

storageRoutes.use(getStorageRoutes)

export default storageRoutes
