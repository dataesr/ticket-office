import { ImapFlow } from "imapflow";
import { MongoClient } from "mongodb";
import * as cheerio from "cheerio";
import { simpleParser } from "mailparser";

const email = process.env.MAIL_ADRESSE;
const password = process.env.MAIL_PASSWORD;
const mailHost = process.env.MAIL_HOST || "";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DATABASE || "ticket-office";

if (!email || !password || !mongoUri || !dbName) {
  throw new Error(
    "MAIL_ADRESSE, MAIL_PASSWORD, DBNAME, MONGO_URI environment variables must be defined"
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

    const contribution = await collection.findOne({ id: referenceId });
    if (contribution) {
      const existingThreads = Array.isArray(contribution.threads)
        ? contribution.threads
        : [];

      const isDuplicate = existingThreads.some(
        (thread) =>
          thread.timestamp === formatDate(timestamp) &&
          thread.responses.some(
            (response: { responseMessage: string }) =>
              response.responseMessage === responseMessage
          )
      );

      if (isDuplicate) {
        console.log(
          "Un thread avec la même date et réponse existe déjà, mise à jour annulée pour la contribution:",
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
          `Mise à jour réussie pour l'ID de référence: ${referenceId}`
        );
        await sendNotificationEmail(referenceId, contribution, collectionName);
      }
    } else {
      console.log(`Aucune mise à jour pour l'ID: ${referenceId}`);
    }
  } finally {
    await client.close();
  }
}

async function sendNotificationEmail(
  referenceId: string,
  contribution: any,
  collectionName: string
) {
  const recipients = process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [];
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not defined");
  }

  const contributionLink = generateContributionLink(
    referenceId,
    contribution.fromApplication,
    collectionName
  );

  const emailData = {
    sender: {
      email: process.env.MAIL_SENDER,
      name: "L'équipe scanR",
    },
    to: recipients.map((email) => ({ email, name: email.split("@")[0] })),
    replyTo: { email: process.env.MAIL_SENDER, name: "L'équipe scanR" },
    subject: "Nouvelle réponse à une contribution",
    templateId: 269,
    params: {
      date: new Date().toLocaleDateString("fr-FR"),
      title: "Nouvelle réponse à une contribution",
      url: contributionLink,
    },
  };
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    console.error(`Erreur d'envoi de l'email: ${response.statusText}`);
  } else {
    console.log(`Email envoyé pour la contribution ID: ${referenceId}`);
  }
}

function generateContributionLink(
  referenceId: string,
  fromApplication: string,
  collectionName: string
) {
  const baseUrl = "https://ticket-office.dataesr.ovh";
  if (collectionName === "contacts") {
    switch (fromApplication) {
      case "scanr":
        return `${baseUrl}/scanr-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
      case "paysage":
        return `${baseUrl}/paysage-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
      case "curiexplore":
        return `${baseUrl}/curiexplore-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
      case "datasupr":
        return `${baseUrl}/datasupr-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
      case "works-magnet":
        return `${baseUrl}/works-magnet-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
      case "bso":
        return `${baseUrl}/bso-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
    }
  }
  if (collectionName === "contribute") {
    return `${baseUrl}/scanr-contributionPage?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
  }
  if (collectionName === "contribute_productions") {
    return `${baseUrl}/apiOperations?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
  }
  if (collectionName === "remove-user") {
    return `${baseUrl}/scanr-removeuser?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
  }
  if (collectionName === "update-user-data") {
    return `${baseUrl}/scanr-namechange?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
  }
  return "";
}
async function processEmailContent(messageSource: string) {
  const parsed = await simpleParser(messageSource);
  const bodyText = parsed.text || parsed.html || "";

  if (!bodyText) {
    console.log("Aucun texte trouvé dans l'email");
    return "";
  }

  const $ = cheerio.load(bodyText);
  let cleanedText = $("body").text().trim();

  cleanedText = cleanedText
    .split("\n")
    .filter((line) => {
      const trimmedLine = line.trim();
      return (
        trimmedLine &&
        !/^(De :|Réponse de|L'équipe scanR vous remercie pour votre contribution)/i.test(
          trimmedLine
        )
      );
    })
    .join("\n")
    .trim();

  return cleanedText;
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

    for await (let message of messages) {
      try {
        if (!message.envelope || !message.source) continue;

        const messageSource = message.source.toString();
        const date = formatDate(message.envelope.date?.toISOString() || null);
        const subject = message.envelope.subject || "";

        const referenceMatch = subject.match(
          /référence\s+([a-zA-Z0-9_-]+)-([a-zA-Z0-9]+)/
        );
        let referenceId = referenceMatch ? referenceMatch[2] : null;
        let collectionPrefix = referenceMatch ? referenceMatch[1] : "contacts";

        const extractedContent = await processEmailContent(messageSource);
        if (!extractedContent) continue;

        const collectionName = determineCollectionName(collectionPrefix);

        await updateContribution(
          referenceId!,
          extractedContent,
          date,
          collectionName
        );
      } catch (err) {
        console.error(`Erreur lors du traitement de l'email : ${err}`);
        continue;
      }
    }
  } finally {
    lock.release();
  }

  await client.logout();
}

function determineCollectionName(collectionPrefix: string) {
  const collections: Record<string, string> = {
    "remove-user": "remove-user",
    contacts: "contacts",
    contribute: "contribute",
    contribute_productions: "contribute_productions",
    "update-user-data": "update-user-data",
  };
  return collections[collectionPrefix] || "contacts";
}

setInterval(() => {
  console.log("Vérification des emails...");
  fetchEmails().catch(console.error);
}, 10 * 1000);
