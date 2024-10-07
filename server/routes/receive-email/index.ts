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
    console.log("Collection:", collectionName);
    if (!collection) {
      console.log("La collection n'existe pas :", collectionName);
      return;
    }

    const contribution = await collection.findOne({
      id: referenceId,
    });

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

      await collection.updateOne(
        { _id: contribution._id },
        { $set: { threads: [...existingThreads, response] } }
      );
      console.log(
        "Réponse ajoutée dans les threads pour la contribution:",
        referenceId
      );
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

export async function fetchEmails() {
  const client = new ImapFlow({
    host: mailHost!,
    port: 993,
    secure: true,
    auth: {
      user: email!,
      pass: password,
    },
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

      console.log("Collection Prefix:", collectionPrefix);
      console.log("Reference ID:", referenceId);

      const startMarker = "Content-Transfer-Encoding: quoted-printable";
      const endMarker = "Le ";

      const startIndex =
        messageSource.indexOf(startMarker) + startMarker.length;
      const endIndex = messageSource.indexOf(endMarker);

      let extractedContent = null;

      if (startIndex !== -1 && endIndex !== -1) {
        extractedContent = messageSource.substring(startIndex, endIndex).trim();
      } else {
        console.log("Les marqueurs de début ou de fin n'ont pas été trouvés.");
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
