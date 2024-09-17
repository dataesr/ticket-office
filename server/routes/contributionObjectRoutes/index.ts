import getContributionObjectRoutes from "./get";
import getContributionObjectByIdRoutes from "./get:id";
import postContributionObjectRoutes from "./post";
import contributionObjectPutRoutes from "./put";

import { Elysia } from "elysia";

export const contributionObjectRoutes = new Elysia();

contributionObjectRoutes.use(getContributionObjectRoutes);
contributionObjectRoutes.use(getContributionObjectByIdRoutes);
contributionObjectRoutes.use(postContributionObjectRoutes);
contributionObjectRoutes.use(contributionObjectPutRoutes);

export default contributionObjectRoutes;
