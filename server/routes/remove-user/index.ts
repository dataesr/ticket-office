import getRemoveUserRoutes from "./get";
import getRemoveUserByIdRoutes from "./get:id";
import postRemoveUserRoutes from "./post";
<<<<<<< HEAD
import removeUserPutRoutes from "./patch";
=======
import removeUserPutRoutes from "./put";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

import { Elysia } from "elysia";

export const removeUserRoutes = new Elysia();

removeUserRoutes.use(getRemoveUserRoutes);
removeUserRoutes.use(getRemoveUserByIdRoutes);
removeUserRoutes.use(postRemoveUserRoutes);
removeUserRoutes.use(removeUserPutRoutes);

export default removeUserRoutes;
