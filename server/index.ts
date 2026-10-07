import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { HttpError } from "./utils/httpError";
import bsoLocalVariationsRoutes from "./routes/bso-local-variations";
import bsoTasksRoutes from "./routes/bso-tasks";
import contactsRoutes from "./routes/contacts";
import contributionObjectRoutes from "./routes/contributionObjectRoutes";
import getLastMailsSentRoutes from "./routes/last-mails-sent";
import productionsRoutes from "./routes/productions";
import getReceivedMailsRoutes, {
  startEmailChecks,
} from "./routes/receive-email";
import removeUserRoutes from "./routes/remove-user";
import sendMailToContribution from "./routes/reply/replyRoutes";
import sendEmail from "./routes/send-email/sendEmailRoutes";
import storageRoutes from "./routes/storage";
import updateUserDataRoutes from "./routes/update-user-data";
import matomo from "./routes/matomo";
import certificatsRoutes, {
  startCertificateChecks,
} from "./routes/certificates";

const ENV = Bun.env.NODE_ENV || "development";
const PORT = parseInt(Bun.env.PORT || "3000");

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
};

const buildApi = () =>
  new Elysia().group("/api", (app) =>
    app
      .use(matomo)
      .use(bsoLocalVariationsRoutes)
      .use(bsoTasksRoutes)
      .use(certificatsRoutes)
      .use(contactsRoutes)
      .use(contributionObjectRoutes)
      .use(getLastMailsSentRoutes)
      .use(getReceivedMailsRoutes)
      .use(productionsRoutes)
      .use(removeUserRoutes)
      .use(sendMailToContribution)
      .use(sendEmail)
      .use(storageRoutes)
      .use(updateUserDataRoutes)
  );

const createApp = async () => {
  return new Elysia()
    .onError(({ code, error, set }) => {
      if (error instanceof HttpError) {
        set.status = error.status;
        return { message: error.message, code: error.code };
      }
      if (code === "VALIDATION") {
        set.status = 422;
        return { message: "Paramètres de requête invalides", code };
      }
      if (code === "NOT_FOUND") {
        set.status = 404;
        return { message: "Ressource introuvable", code };
      }
      console.error("[server] Erreur non gérée:", error);
      set.status = 500;
      return { message: "Erreur interne du serveur", code };
    })
    .use(cors({ origin: "*" }))
    .use(swagger({ path: "/swagger", ...swaggerConfig }))
    .use(buildApi())
    .use(
      await staticPlugin({
        assets: "public",
        prefix: "",
        indexHTML: false,
        alwaysStatic: true,
      })
    )
    .get("*", () => Bun.file("public/index.html"))
    .listen(PORT);
};

createApp()
  .then((app) => {
    const startupTime = Math.floor(process.uptime() * 1000);
    const serverUrl = app.server?.url;

    console.info(`
      ELYSIA [🦊] ready in ${startupTime}ms
      Running in ${String(ENV).toUpperCase()} environment

      ➜ Local:          ${serverUrl}
      ➜ Documentation:  ${serverUrl}swagger
    `);

    // Jobs de fond : lancés explicitement une fois le serveur démarré.
    // Chacun est isolé pour qu'un échec n'empêche pas l'autre de démarrer.
    for (const startJob of [startCertificateChecks, startEmailChecks]) {
      try {
        startJob();
      } catch (error) {
        console.error(`[jobs] Échec du démarrage de ${startJob.name}:`, error);
      }
    }
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

export default { createApp };
