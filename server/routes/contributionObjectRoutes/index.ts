import getContributionObjectRoutes from "./get";
import getContributionObjectByIdRoutes from "./get:id";
import postContributionObjectRoutes from "./post";
<<<<<<< HEAD
<<<<<<< HEAD
import contributionObjectPutRoutes from "./patch";
=======
import contributionObjectPutRoutes from "./put";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import contributionObjectPutRoutes from "./patch";
>>>>>>> 2e9190f (fix(api): update schemas)

import { Elysia } from "elysia";

export const contributionObjectRoutes = new Elysia();

contributionObjectRoutes.use(getContributionObjectRoutes);
contributionObjectRoutes.use(getContributionObjectByIdRoutes);
contributionObjectRoutes.use(postContributionObjectRoutes);
contributionObjectRoutes.use(contributionObjectPutRoutes);

export default contributionObjectRoutes;
