import { Elysia } from "elysia";
<<<<<<< HEAD
<<<<<<< HEAD
import staticPlugin from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import dotenv from "dotenv";
import { cors } from "@elysiajs/cors";

=======
=======
import staticPlugin from "@elysiajs/static";
>>>>>>> 824b180 (fix(ci): update workflow)
import { swagger } from "@elysiajs/swagger";
import dotenv from "dotenv";
import { cors } from "@elysiajs/cors";
import contactRoutes from "./routes/contact";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
import contributionObjectRoutes from "./routes/contributionObjectRoutes";
import productionsRoutes from "./routes/productions";
import removeUserRoutes from "./routes/remove-user";
import updateUserDataRoutes from "./routes/update-user-data";
<<<<<<< HEAD
import contactsRoutes from "./routes/contacts";
import sendMail from "./routes/reply/replyRoutes";
import { fetchEmails } from "./routes/receive-email";
=======
import replyRoutes from "./routes/reply/replyRoutes";
// import connectToImapServer from "./routes/receive-email";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

dotenv.config();

const app = new Elysia();
<<<<<<< HEAD
fetchEmails();
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
            name: "Supressions de profil",
            description: "Gestion des demandes supression de profil",
          },
          {
            name: "Mise à jour de données utilisateurs",
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
    app.use(contactsRoutes);
    app.use(contributionObjectRoutes);
    app.use(productionsRoutes);
    app.use(removeUserRoutes);
    app.use(updateUserDataRoutes);
    app.use(sendMail);
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
=======

// Appelez la fonction pour récupérer les e-mails
// connectToImapServer();

app.use(cors());
app.use(swagger());
// api comme préfixe pour toutes les routes
app.group("/api", (app) => {
  app.use(contactRoutes);
  app.use(contributionObjectRoutes);
  app.use(productionsRoutes);
  app.use(removeUserRoutes);
  app.use(updateUserDataRoutes);
  app.use(replyRoutes);
  return app;
});
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
app.use(
  staticPlugin({
    assets: "public",
    prefix: "",
    alwaysStatic: true,
  })
);
app.get("*", () => Bun.file("public/index.html"));
>>>>>>> 824b180 (fix(ci): update workflow)

export default app;
