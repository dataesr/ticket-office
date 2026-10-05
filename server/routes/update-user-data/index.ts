import getUpdateUserDataRoutes from "./get";
import getUpdateUserDataByIdRoutes from "./get_id";
import postUpdateUserDataRoutes from "./post";
import updateUserDataPutRoutes from "./patch";

import { Elysia } from "elysia";

export const updateUserDataRoutes = new Elysia()
  .use(getUpdateUserDataRoutes)
  .use(getUpdateUserDataByIdRoutes)
  .use(postUpdateUserDataRoutes)
  .use(updateUserDataPutRoutes);

export default updateUserDataRoutes;
