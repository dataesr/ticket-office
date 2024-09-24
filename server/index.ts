import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import dotenv from "dotenv";
import { cors } from "@elysiajs/cors";

import contactRoutes from "./routes/contact";
import contributionObjectRoutes from "./routes/contributionObjectRoutes";
import productionsRoutes from "./routes/productions";
import removeUserRoutes from "./routes/remove-user";
import updateUserDataRoutes from "./routes/update-user-data";
import replyRoutes from "./routes/reply/replyRoutes";
// import connectToImapServer from "./routes/receive-email";

dotenv.config();

const app = new Elysia();
app
  .use(
    cors({
      origin: "*",
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          version: "1.0.0",
          title: "Mon API",
          description: "API du bureau des plaintes",
          contact: {
            name: "Mihoub",
            email: "scanr@recherche.gouv.fr",
          },
        },
        tags: [
          { name: "Contact", description: "Gestion des contacts" },
          { name: "Contributions", description: "Gestion des contributions" },
          { name: "Productions", description: "Gestion des productions" },
          {
            name: "Supression de profil",
            description: "Gestion des demandes supression de profil",
          },
          {
            name: "Mise à jour de données utilisateur",
            description:
              "Gestion des demandes de mise à jour de données utilisateur",
          },
        ],
      },
    })
  )
  .onError(({ code, error }) => {
    return new Response(error.toString());
  })
  .group("/api", (app) => {
    app.use(contactRoutes);
    app.use(contributionObjectRoutes);
    app.use(productionsRoutes);
    app.use(removeUserRoutes);
    app.use(updateUserDataRoutes);
    app.use(replyRoutes);
    return app;
  })
  .use(
    staticPlugin({
      assets: "public",
      prefix: "",
      alwaysStatic: true,
    })
  )
  .get("*", () => Bun.file("public/index.html"));

export default app;
