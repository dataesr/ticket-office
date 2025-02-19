import getFileRoute from "./get-file"
import uploadFileRoute from "./upload-file"

import { Elysia } from "elysia"

export const storageRoutes = new Elysia()

storageRoutes.use(getFileRoute)
storageRoutes.use(uploadFileRoute)

export default storageRoutes
