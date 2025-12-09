import { Elysia } from "elysia";
import matomoRoutes from "./matomoRoutes";

export const matomo = new Elysia();

matomo.use(matomoRoutes);

export default matomo;
