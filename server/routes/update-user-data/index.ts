import getUpdateUserDataRoutes from "./get";
import getUpdateUserDataByIdRoutes from "./get_id";
import postUpdateUserDataRoutes from "./post";
import updateUserDataPutRoutes from "./patch";

import { Elysia } from "elysia";

export const updateUserDataRoutes = new Elysia();

updateUserDataRoutes.use(getUpdateUserDataRoutes);
updateUserDataRoutes.use(getUpdateUserDataByIdRoutes);
updateUserDataRoutes.use(postUpdateUserDataRoutes);
updateUserDataRoutes.use(updateUserDataPutRoutes);

export default updateUserDataRoutes;
