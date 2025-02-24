import { Elysia } from "elysia"
import staticPlugin from "@elysiajs/static"
import { swagger } from "@elysiajs/swagger"
import dotenv from "dotenv"
import { cors } from "@elysiajs/cors"

import contributionObjectRoutes from "./routes/contributionObjectRoutes"
import productionsRoutes from "./routes/productions"
import removeUserRoutes from "./routes/remove-user"
import updateUserDataRoutes from "./routes/update-user-data"
import contactsRoutes from "./routes/contacts"
import sendMail from "./routes/reply/replyRoutes"
import getReceivedMailsRoutes from "./routes/receive-email"
import getLastMailsSentRoutes from "./routes/last-mails-sent"
import variationsRoutes from "./routes/variations"
import storageRoutes from "./routes/storage"

dotenv.config()

const app = new Elysia()
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
          { name: "Contacts", description: "Gestion des contacts" },
          { name: "Contributions", description: "Gestion des contributions" },
          { name: "Productions", description: "Gestion des productions" },
          { name: "Envoi de mails", description: "Envoi de mails" },
          {
            name: "Suppressions de profil",
            description: "Gestion des demandes suppression de profil",
          },
          {
            name: "Mise à jour de données utilisateurs",
            description: "Gestion des demandes de mise à jour de données utilisateur",
          },
          {
            name: "Déclinaisons locales",
            description: "Gestion des demandes de déclinaisons locales",
          },
        ],
      },
    })
  )
  .onError(({ code, error }) => {
    return new Response(error.toString())
  })
  .group("/api", (app) => {
    app.use(contactsRoutes)
    app.use(contributionObjectRoutes)
    app.use(productionsRoutes)
    app.use(removeUserRoutes)
    app.use(updateUserDataRoutes)
    app.use(sendMail)
    app.use(getLastMailsSentRoutes)
    app.use(getReceivedMailsRoutes)
    app.use(variationsRoutes)
    app.use(storageRoutes)
    return app
  })
  .use(
    staticPlugin({
      assets: "public",
      prefix: "",
      alwaysStatic: true,
    })
  )
  .get("*", () => Bun.file("public/index.html"))

export default app
