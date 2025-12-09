import { Elysia } from "elysia";
import lastReceivedMail from "./get";
import { fetchEmails } from "./imap-server/email";
import { validateConfig } from "./imap-server/config";

validateConfig();

if (process.env.APP_ENV === "production" || process.env.APP_ENV === "staging") {
  console.log("Démarrage de la vérification périodique des emails...");
  setInterval(() => {
    console.log("Vérification des emails...");
    fetchEmails().catch((error) => {
      console.error("Erreur lors de la vérification des emails:", error);
    });
  }, 15 * 60 * 1000);
  // 15 minutes = 900 000 ms
} else {
  console.log(
    "Mode développement ou staging: vérification des emails désactivée"
  );
}

export const getReceivedMailsRoutes = new Elysia();
getReceivedMailsRoutes.use(lastReceivedMail);

export default getReceivedMailsRoutes;
