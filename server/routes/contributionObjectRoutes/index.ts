import getContributionObjectRoutes from "./get";
import getContributionObjectByIdRoutes from "./get:id";
import postContributionObjectRoutes from "./post";
<<<<<<< HEAD
import contributionObjectPutRoutes from "./patch";
=======
import contributionObjectPutRoutes from "./put";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

import { Elysia } from "elysia";

export const contributionObjectRoutes = new Elysia();

contributionObjectRoutes.use(getContributionObjectRoutes);
contributionObjectRoutes.use(getContributionObjectByIdRoutes);
contributionObjectRoutes.use(postContributionObjectRoutes);
contributionObjectRoutes.use(contributionObjectPutRoutes);

export default contributionObjectRoutes;
