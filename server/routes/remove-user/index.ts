import getRemoveUserRoutes from "./get";
import getRemoveUserByIdRoutes from "./get_id";
import postRemoveUserRoutes from "./post";
import removeUserPutRoutes from "./patch";

import { Elysia } from "elysia";

export const removeUserRoutes = new Elysia();

removeUserRoutes.use(getRemoveUserRoutes);
removeUserRoutes.use(getRemoveUserByIdRoutes);
removeUserRoutes.use(postRemoveUserRoutes);
removeUserRoutes.use(removeUserPutRoutes);

export default removeUserRoutes;
