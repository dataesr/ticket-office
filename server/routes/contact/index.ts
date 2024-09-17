import getContactRoutes from "./get";
import getContactByIdRoutes from "./get:id";
import postContactRoutes from "./post";
import contactPutRoutes from "./put";

import { Elysia } from "elysia";

export const contactRoutes = new Elysia();

contactRoutes.use(getContactRoutes);
contactRoutes.use(getContactByIdRoutes);
contactRoutes.use(postContactRoutes);
contactRoutes.use(contactPutRoutes);

export default contactRoutes;
