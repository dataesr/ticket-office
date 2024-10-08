import { ImapFlow } from "imapflow";
import { MongoClient } from "mongodb";

const email = process.env.MAIL_ADRESSE;
const password = process.env.MAIL_PASSWORD;
const mailHost = process.env.MAIL_HOST || "";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = "ticket-office-api";

if (!email || !password || !mongoUri) {
  throw new Error(
    "MAIL_ADRESSE, MAIL_PASSWORD and MONGO_URI environment variables must be defined"
  );
}
function formatDate(dateString: string | number | Date | null) {
  const date = new Date(dateString || "");
  return date.toISOString();
}
async function updateContribution(
  referenceId: string,
  responseMessage: string,
  timestamp: string | null,
  collectionName: string
) {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    if (!collection) {
      console.log("La collection n'existe pas :", collectionName);
      return;
    }

    const contribution = await collection.findOne({ id: referenceId });
    if (contribution) {
      const existingThreads = Array.isArray(contribution.threads)
        ? contribution.threads
        : [];

      const isDuplicate = existingThreads.some(
        (thread) => thread.timestamp === formatDate(timestamp)
      );

      if (isDuplicate) {
        console.log(
          "Un thread avec la même date existe déjà, mise à jour annulée pour la contribution:",
          referenceId
        );
        return;
      }

      const response = {
        threadId: contribution._id.toString(),
        responses: [
          {
            responseMessage,
            read: false,
            timestamp: formatDate(timestamp),
            team: ["user"],
          },
        ],
        timestamp: formatDate(timestamp),
      };

      const updateResult = await collection.updateOne(
        { _id: contribution._id },
        { $set: { threads: [...existingThreads, response] } }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(
          `Contribution mise à jour avec succès pour l'ID de référence: ${referenceId}`
        );
        await sendNotificationEmail(referenceId, contribution, responseMessage);
      } else {
        console.log(
          `Aucune contribution mise à jour pour l'ID de référence: ${referenceId}`
        );
      }
    } else {
      console.log(
        "Aucune contribution trouvée pour l'ID de référence",
        referenceId
      );
    }
  } finally {
    await client.close();
  }
}

async function sendNotificationEmail(
  referenceId: string,
  contribution: any,
  responseMessage: string
) {
  const recipients = {
    to: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
  };
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not defined");
  }
  const dataForBrevo = {
    sender: {
      email: process.env.MAIL_SENDER,
      name: "L'équipe scanR",
    },
    to: recipients.to.map((email: string) => ({
      email,
      name: email.split("@")[0],
    })),
    replyTo: { email: process.env.MAIL_SENDER, name: "L'équipe scanR" },
    subject: "Nouvelle réponse à une contribution",
    templateId: 268,
    params: {
      date: new Date().toLocaleDateString("fr-FR"),
      message: `La contribution avec l'ID ${referenceId} a été mise à jour. Vous pouvez consulter la contribution en cliquant sur le lien suivant : URL A VENIR`,
    },
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify(dataForBrevo),
  });

  if (!response.ok) {
    console.error(`Erreur d'envoi d'email: ${response.statusText}`);
  } else {
    console.log(
      `Email envoyé avec succès pour la contribution ID: ${referenceId}`
    );
  }
}
export async function fetchEmails() {
  const client = new ImapFlow({
    host: mailHost!,
    port: 993,
    secure: true,
    auth: {
      user: email!,
      pass: password,
    },
    logger: false,
  });

  await client.connect();

  let lock = await client.getMailboxLock("INBOX");
  try {
    const messages = await client.fetch("1:*", {
      source: true,
      envelope: true,
    });

    const emails = [];
    for await (let message of messages) {
      try {
        if (!message.envelope || !message.source) {
          console.warn("Message sans enveloppe ou contenu, ignoré.");
          continue;
        }

        const messageSource = message.source.toString();
        const date = message.envelope.date?.toISOString() || null;
        const subject = message.envelope.subject || null;

        const referenceMatch = subject?.match(
          /référence\s+([a-zA-Z0-9_-]+)-([a-zA-Z0-9]+)/
        );
        let referenceId = null;
        let collectionPrefix = null;

        if (referenceMatch) {
          collectionPrefix = referenceMatch[1];
          referenceId = referenceMatch[2];
        }

        const startMarker = "Content-Transfer-Encoding: quoted-printable";
        const endMarker = "Le ";
        const startIndex =
          messageSource.indexOf(startMarker) + startMarker.length;
        const endIndex = messageSource.indexOf(endMarker);

        let extractedContent = null;

        // Vérifie que les marqueurs existent bien
        if (startIndex !== -1 && endIndex !== -1) {
          extractedContent = messageSource
            .substring(startIndex, endIndex)
            .trim();
        } else {
          console.log(
            "Les marqueurs de début ou de fin n'ont pas été trouvés. Email ignoré."
          );
          continue;
        }

        emails.push({
          content: extractedContent,
          date: formatDate(date),
          referenceId,
        });

        if (referenceId && extractedContent) {
          const collectionName = determineCollectionName(
            collectionPrefix || "default"
          );
          await updateContribution(
            referenceId,
            extractedContent,
            formatDate(date),
            collectionName
          );
        }
      } catch (emailProcessingError) {
        console.error(
          "Erreur lors du traitement de l'email :",
          emailProcessingError
        );
      }
    }
  } finally {
    lock.release();
  }

  await client.logout();
}

function determineCollectionName(collectionPrefix: string) {
  if (collectionPrefix === "remove-user") {
    return "remove-user";
  } else if (collectionPrefix === "contacts") {
    return "contacts";
  } else if (collectionPrefix === "contribute") {
    return "contribute";
  } else if (collectionPrefix === "contribute_productions") {
    return "contribute_productions";
  } else if (collectionPrefix === "update-user-data") {
    return "update-user-data";
  }
  return "contacts";
}
setInterval(() => {
  console.log("Vérification des emails...");
  fetchEmails().catch((err) => console.error(err));
}, 60 * 1000);
