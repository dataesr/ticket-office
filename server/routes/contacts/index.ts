import getContactRoutes from "./get";
import getContactByIdRoutes from "./get_id";
import postContactRoutes from "./post";
import contactPutRoutes from "./patch";

import { Elysia } from "elysia";

export const contactsRoutes = new Elysia();

contactsRoutes.use(getContactRoutes);
contactsRoutes.use(getContactByIdRoutes);
contactsRoutes.use(postContactRoutes);
contactsRoutes.use(contactPutRoutes);

export default contactsRoutes;
