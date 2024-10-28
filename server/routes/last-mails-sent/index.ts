import { Elysia } from "elysia";
import lastSentMail from "./get";

export const getLastMailsSentRoutes = new Elysia();

getLastMailsSentRoutes.use(lastSentMail);

export default getLastMailsSentRoutes;
