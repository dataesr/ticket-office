import getContactRoutes from "./get";
import getContactByIdRoutes from "./get_id";
import postContactRoutes from "./post";
import contactPutRoutes from "./patch";

import { Elysia } from "elysia";

export const contactsRoutes = new Elysia()
  .use(getContactRoutes)
  .use(getContactByIdRoutes)
  .use(postContactRoutes)
  .use(contactPutRoutes);

export default contactsRoutes;
