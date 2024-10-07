import { Elysia } from "elysia";
<<<<<<< HEAD
<<<<<<< HEAD
import staticPlugin from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import dotenv from "dotenv";
import { cors } from "@elysiajs/cors";

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
import staticPlugin from "@elysiajs/static";
>>>>>>> 824b180 (fix(ci): update workflow)
import { swagger } from "@elysiajs/swagger";
import dotenv from "dotenv";
import { cors } from "@elysiajs/cors";
=======
>>>>>>> c249e13 (fix(api): change url for request on staging)
import contactRoutes from "./routes/contact";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
import contributionObjectRoutes from "./routes/contributionObjectRoutes";
import productionsRoutes from "./routes/productions";
import removeUserRoutes from "./routes/remove-user";
import updateUserDataRoutes from "./routes/update-user-data";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import contactsRoutes from "./routes/contacts";
import sendMail from "./routes/reply/replyRoutes";
import { fetchEmails } from "./routes/receive-email";
=======
import replyRoutes from "./routes/reply/replyRoutes";
=======
// import replyRoutes from "./routes/reply/replyRoutes";
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
=======
>>>>>>> abc94ae (fix(send-mail): add send mail route to ui)
import contactsRoutes from "./routes/contacts";
import sendMail from "./routes/reply/replyRoutes";
import { fetchEmails } from "./routes/receive-email";
<<<<<<< HEAD
// import connectToImapServer from "./routes/receive-email";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 7d1545e (fix(mongo): update connexion to mongo)

dotenv.config();

const app = new Elysia();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
fetchEmails();
=======
>>>>>>> 8372f23 (fix(edit): update package delete dep)
=======
fetchEmails();
>>>>>>> ca679c1 (feat(imap-server): add imap server)
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
<<<<<<< HEAD
<<<<<<< HEAD
          description: "API du bureau des plaintes",
          contact: {
            name: "Mihoub",
            email: "scanr@recherche.gouv.fr",
          },
        },
        tags: [
          { name: "Contacts", description: "Gestion des contacts" },
<<<<<<< HEAD
          { name: "Contributions", description: "Gestion des contributions" },
          { name: "Productions", description: "Gestion des productions" },
<<<<<<< HEAD
<<<<<<< HEAD
          { name: "Envoi de mails", description: "Envoi de mails" },
=======
          { name: "Envoi de mails", description: "Gestion de emails" },
>>>>>>> abc94ae (fix(send-mail): add send mail route to ui)
=======
          { name: "Envoi de mails", description: "Envoi de mails" },
>>>>>>> ca679c1 (feat(imap-server): add imap server)
          {
            name: "Supressions de profil",
            description: "Gestion des demandes supression de profil",
          },
          {
            name: "Mise à jour de données utilisateurs",
            description:
              "Gestion des demandes de mise à jour de données utilisateur",
          },
=======
          description: "API pour gérer les contributions et contacts",
=======
          description: "API du bureau des plaintes",
>>>>>>> 2e9190f (fix(api): update schemas)
          contact: {
            name: "Mihoub",
            email: "scanr@recherche.gouv.fr",
          },
        },
        tags: [
          { name: "Contact", description: "Gestion des contacts" },
=======
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
          { name: "Contributions", description: "Gestion des contributions" },
          { name: "Productions", description: "Gestion des productions" },
<<<<<<< HEAD
>>>>>>> 8372f23 (fix(edit): update package delete dep)
=======
          {
            name: "Supressions de profil",
            description: "Gestion des demandes supression de profil",
          },
          {
            name: "Mise à jour de données utilisateurs",
            description:
              "Gestion des demandes de mise à jour de données utilisateur",
          },
>>>>>>> 2e9190f (fix(api): update schemas)
        ],
      },
    })
  )
<<<<<<< HEAD
<<<<<<< HEAD
  .onError(({ code, error }) => {
    return new Response(error.toString());
  })
  .group("/api", (app) => {
    app.use(contactsRoutes);
<<<<<<< HEAD
=======
=======
  .onError(({ code, error }) => {
    return new Response(error.toString());
  })
>>>>>>> 2e9190f (fix(api): update schemas)
  .group("/api", (app) => {
    app.use(contactRoutes);
>>>>>>> 8372f23 (fix(edit): update package delete dep)
=======
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    app.use(contributionObjectRoutes);
    app.use(productionsRoutes);
    app.use(removeUserRoutes);
    app.use(updateUserDataRoutes);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> abc94ae (fix(send-mail): add send mail route to ui)
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
=======
    app.use(replyRoutes);
=======
    // app.use(replyRoutes);
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
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
>>>>>>> 8372f23 (fix(edit): update package delete dep)

export default app;
