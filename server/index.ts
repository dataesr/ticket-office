import { cors } from "@elysiajs/cors"
import staticPlugin from "@elysiajs/static"
import { swagger } from "@elysiajs/swagger"
import { Elysia } from "elysia"

import bsoLocalVariationsRoutes from "./routes/bso-local-variations"
import bsoTasksRoutes from "./routes/bso-tasks"
import contactsRoutes from "./routes/contacts"
import contributionObjectRoutes from "./routes/contributionObjectRoutes"
import getLastMailsSentRoutes from "./routes/last-mails-sent"
import productionsRoutes from "./routes/productions"
import getReceivedMailsRoutes from "./routes/receive-email"
import removeUserRoutes from "./routes/remove-user"
import sendMail from "./routes/reply/replyRoutes"
import storageRoutes from "./routes/storage"
import updateUserDataRoutes from "./routes/update-user-data"

const ENV = Bun.env.NODE_ENV || "development"
const PORT = parseInt(Bun.env.PORT || "3000")

const swaggerConfig = {
  documentation: {
    info: {
      version: "1.0.0",
      title: "Ticket-Office API",
      description: "API du bureau des plaintes",
      contact: {
        name: "DATAESR",
        email: "scanr@mesri.ovh",
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
}

const buildApi = () => {
  return new Elysia().group("/api", (app) => {
    app.use(bsoLocalVariationsRoutes)
    app.use(bsoTasksRoutes)
    app.use(contactsRoutes)
    app.use(contributionObjectRoutes)
    app.use(getLastMailsSentRoutes)
    app.use(getReceivedMailsRoutes)
    app.use(productionsRoutes)
    app.use(removeUserRoutes)
    app.use(sendMail)
    app.use(storageRoutes)
    app.use(updateUserDataRoutes)
    return app
  })
}

const createApp = async () => {
  return new Elysia()
    .use(cors({ origin: "*" }))
    .use(swagger({ path: "/swagger", ...swaggerConfig }))
    .use(buildApi())
    .use(
      staticPlugin({
        assets: "public",
        prefix: "",
        alwaysStatic: true,
      })
    )
    .get("*", () => Bun.file("public/index.html"))
    .listen(PORT)
}

createApp()
  .then((app) => {
    const startupTime = Math.floor(process.uptime() * 1000)
    const serverUrl = app.server?.url

    console.info(`
      ELYSIA [🦊] ready in ${startupTime}ms
      Running in ${String(ENV).toUpperCase()} environment

      ➜ Local:          ${serverUrl}
      ➜ Documentation:  ${serverUrl}swagger
    `)
  })
  .catch((error) => {
    console.error("Error while starting the server", error)
    process.exit(1)
  })

process.on("SIGINT", () => {
  console.log("Shutting down!")
  process.exit(0)
})
process.on("SIGTERM", () => {
  console.log("Shutting down!")
  process.exit(0)
})

export default { createApp }
