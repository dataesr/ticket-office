import imap from "imap";
import { ImapSimple, connect } from "imap-simple";

const MAIL_ADRESSE = process.env.MAIL_ADRESSE || "";
const MAIL_PASSWORD = process.env.MAIL_PASSWORD || "";
const MAIL_HOST = process.env.MAIL_HOST || "";

const imapConfig: imap.Config = {
  user: MAIL_ADRESSE,
  password: MAIL_PASSWORD,
  host: MAIL_HOST,
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
};

export default async function connectToImapServer() {
  try {
    console.log("Connecting to IMAP server...");
    console.log(imapConfig);

    // Connexion au serveur IMAP
    const connection: ImapSimple = await connect({ imap: imapConfig });
    console.log("IMAP Connection Established");

    connection.on("ready", () => {
      console.log("IMAP Connection Ready");
    });

    connection.on("error", (err) => {
      console.error("IMAP Connection Error:", err);
    });

    connection.on("end", () => {
      console.log("IMAP Connection Ended");
    });

    try {
      const inbox = await connection.openBox("INBOX");
      console.log("INBOX opened:", inbox);

      // Rechercher les emails dans la boîte
      const searchCriteria = ["ALL"]; // Critères de recherche, par exemple ['UNSEEN'] pour les emails non lus
      const fetchOptions = {
        bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
        struct: true,
      };

      const messages = await connection.search(searchCriteria, fetchOptions);
      console.log(`Found ${messages.length} message(s)`);

      messages.forEach((message) => {
        // Extraire les parties de l'email
        const header = message.parts.find(
          (part) => part.which === "HEADER.FIELDS (FROM TO SUBJECT DATE)"
        );
        const body = message.parts.find((part) => part.which === "TEXT");

        if (header) {
          console.log("Email Header:", header.body);
        }

        if (body) {
          console.log("Email Body:", body.body);
        }
      });
    } catch (err) {
      console.error("Error opening INBOX or retrieving emails:", err);
    }
  } catch (error) {
    console.error("Failed to connect to IMAP server:", error);
  }
}

connectToImapServer();
