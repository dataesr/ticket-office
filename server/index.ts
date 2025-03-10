import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import dotenv from "dotenv";

import contributionObjectRoutes from "./routes/contributionObjectRoutes";
import productionsRoutes from "./routes/productions";
import removeUserRoutes from "./routes/remove-user";
import updateUserDataRoutes from "./routes/update-user-data";
import contactsRoutes from "./routes/contacts";
import sendMail from "./routes/reply/replyRoutes";
import getReceivedMailsRoutes from "./routes/receive-email";
import getLastMailsSentRoutes from "./routes/last-mails-sent";
import variationsRoutes from "./routes/variations";
import storageRoutes from "./routes/storage";
import bsoTasksRoutes from "./routes/bso-tasks";

dotenv.config();

const ENV = Bun.env.NODE_ENV || "development";

const createApp = async () => {
  switch (ENV) {
    case "production":
      return new Elysia()
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
                { name: "Contacts", description: "Gestion des contacts" },
                {
                  name: "Contributions",
                  description: "Gestion des contributions",
                },
                { name: "Productions", description: "Gestion des productions" },
                { name: "Envoi de mails", description: "Envoi de mails" },
                {
                  name: "Suppressions de profil",
                  description: "Gestion des demandes suppression de profil",
                },
                {
                  name: "Mise à jour de données utilisateurs",
                  description:
                    "Gestion des demandes de mise à jour de données utilisateur",
                },
                {
                  name: "Déclinaisons locales",
                  description: "Gestion des demandes de déclinaisons locales",
                },
                {
                  name: "Object storage",
                  description: "Gestion de fichiers sur object storage (OVH)",
                },
                {
                  name: "Tâches",
                  description: "Gestion des tâches (BSO)",
                },
              ],
            },
          })
        )
        .group("/api", (app) => {
          app.use(contactsRoutes);
          app.use(contributionObjectRoutes);
          app.use(productionsRoutes);
          app.use(removeUserRoutes);
          app.use(updateUserDataRoutes);
          app.use(sendMail);
          app.use(getLastMailsSentRoutes);
          app.use(getReceivedMailsRoutes);
          app.use(variationsRoutes);
          app.use(storageRoutes);
          app.use(bsoTasksRoutes);
          return app;
        })
        .use(staticPlugin({ prefix: "", alwaysStatic: true }))
        .get("*", () => Bun.file("./public/index.html"))
        .listen(3000);
    default:
      return new Elysia()
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
                { name: "Contacts", description: "Gestion des contacts" },
                {
                  name: "Contributions",
                  description: "Gestion des contributions",
                },
                { name: "Productions", description: "Gestion des productions" },
                { name: "Envoi de mails", description: "Envoi de mails" },
                {
                  name: "Suppressions de profil",
                  description: "Gestion des demandes suppression de profil",
                },
                {
                  name: "Mise à jour de données utilisateurs",
                  description:
                    "Gestion des demandes de mise à jour de données utilisateur",
                },
                {
                  name: "Déclinaisons locales",
                  description: "Gestion des demandes de déclinaisons locales",
                },
                {
                  name: "Object storage",
                  description: "Gestion de fichiers sur object storage (OVH)",
                },
                {
                  name: "Tâches",
                  description: "Gestion des tâches (BSO)",
                },
              ],
            },
          })
        )
        .group("/api", (app) => {
          app.use(contactsRoutes);
          app.use(contributionObjectRoutes);
          app.use(productionsRoutes);
          app.use(removeUserRoutes);
          app.use(updateUserDataRoutes);
          app.use(sendMail);
          app.use(getLastMailsSentRoutes);
          app.use(getReceivedMailsRoutes);
          app.use(variationsRoutes);
          app.use(storageRoutes);
          app.use(bsoTasksRoutes);
          return app;
        })
        .listen(3000);
  }
};

createApp()
  .then((app) => {
    const startupTime = Math.floor(process.uptime() * 1000);
    const serverUrl = app.server?.url;

    console.info(`
  ELYSIA  [🦊] ready in ${startupTime}ms
  Running in ${String(ENV).toUpperCase()} environement

  ➜ Local:          ${serverUrl}
  ➜ Documentation:  ${serverUrl}swagger
`);
  })
  .catch((error) => {
    console.error("Error while starting the server", error);
    process.exit(1);
  });

process.on("SIGINT", () => {
  console.log("Shutting down!");
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("Shutting down!");
  process.exit(0);
});
