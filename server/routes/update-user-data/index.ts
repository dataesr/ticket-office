import getUpdateUserDataRoutes from "./get";
import getUpdateUserDataByIdRoutes from "./get:id";
import postUpdateUserDataRoutes from "./post";
<<<<<<< HEAD
<<<<<<< HEAD
import updateUserDataPutRoutes from "./patch";
=======
import updateUserDataPutRoutes from "./put";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import updateUserDataPutRoutes from "./patch";
>>>>>>> 2e9190f (fix(api): update schemas)

import { Elysia } from "elysia";

export const updateUserDataRoutes = new Elysia();

updateUserDataRoutes.use(getUpdateUserDataRoutes);
updateUserDataRoutes.use(getUpdateUserDataByIdRoutes);
updateUserDataRoutes.use(postUpdateUserDataRoutes);
updateUserDataRoutes.use(updateUserDataPutRoutes);

export default updateUserDataRoutes;
