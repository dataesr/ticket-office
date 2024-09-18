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
app.use(
  staticPlugin({
    assets: "public",
    prefix: "",
    alwaysStatic: true,
  })
);
app.get("*", () => Bun.file("public/index.html"));

export default app;
