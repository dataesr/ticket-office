import { Elysia } from "elysia";
import lastSentMail from "./get";

export const getLastMailsSentRoutes = new Elysia().use(lastSentMail);

export default getLastMailsSentRoutes;
