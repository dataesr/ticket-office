import getContributionObjectRoutes from "./get";
import getContributionObjectByIdRoutes from "./get_id";
import postContributionObjectRoutes from "./post";
import contributionObjectPutRoutes from "./patch";

import { Elysia } from "elysia";

export const contributionObjectRoutes = new Elysia()
  .use(getContributionObjectRoutes)
  .use(getContributionObjectByIdRoutes)
  .use(postContributionObjectRoutes)
  .use(contributionObjectPutRoutes);

export default contributionObjectRoutes;
