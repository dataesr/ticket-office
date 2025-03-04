import { ImapFlow } from "imapflow";
import { MongoClient } from "mongodb";
import * as cheerio from "cheerio";
import { simpleParser } from "mailparser";
import lastReceivedMail from "./get";
import Elysia from "elysia";

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

    if (!contribution) {
      console.log(`Aucune contribution trouvée pour l'ID: ${referenceId}`);
      return;
    }

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
      console.log("Réponse déjà enregistrée, aucune mise à jour effectuée.");
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
      console.log(`Mise à jour réussie pour l'ID de référence: ${referenceId}`);
      await sendNotificationEmail(referenceId, contribution, collectionName);
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
  if (!contribution.email || !contribution.id) {
    console.error(`Invalid contribution data for ID: ${referenceId}`);
    return;
  }

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

async function saveReceivedEmail(
  envelope: any,
  messageSource: string,
  extractedContent: string,
  date: string
) {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection("received_emails");
    const existingEmail = await collection.findOne({
      messageId: envelope.messageId,
      date: date,
    });

    if (existingEmail) {
      console.log(
        `Email déjà enregistré : ${envelope.messageId} à la date ${date}`
      );
      return;
    }

    const emailData = {
      messageId: envelope.messageId,
      from: envelope.from,
      to: envelope.to,
      subject: envelope.subject,
      date,
      rawContent: messageSource,
      extractedText: extractedContent,
      createdAt: new Date(),
    };

    await collection.insertOne(emailData);
    console.log(
      `Email enregistré dans received_emails : ${envelope.messageId}`
    );
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'email :", error);
  } finally {
    await client.close();
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
  if (collectionName === "local_variations") {
    return `${baseUrl}/bso-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`;
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

  const base64Pattern = /([A-Za-z0-9+/=]{100,})(?=\s|$)/g;
  if (base64Pattern.test(cleanedText)) {
    cleanedText = "[Contenu binaire ignoré]";
  }

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
    const messageList: {
      date: string;
      source: string;
      envelope: any;
      referenceId: string | null;
      collectionPrefix: string;
    }[] = [];

    for await (let message of messages) {
      if (!message.envelope || !message.source) continue;

      const messageSource = message.source.toString();
      const date = formatDate(message.envelope.date?.toISOString() || null);
      const subject = message.envelope.subject || "";
      const cleanSubject = subject
        .replace(/Re:\s*|\[?[*]?PUB[*]?\]?/gi, "")
        .trim();

      const referenceMatch = cleanSubject.match(
        /référence[\s:]+([a-zA-Z0-9_-]+)-([a-fA-F0-9]{24})/i
      );

      let referenceId = referenceMatch ? referenceMatch[2] : null;
      let collectionPrefix = referenceMatch ? referenceMatch[1] : "contacts";

      const extractedContent = await processEmailContent(messageSource);
      if (!extractedContent) continue;

      await saveReceivedEmail(
        message.envelope,
        messageSource,
        extractedContent,
        date
      );

      messageList.push({
        date,
        source: messageSource,
        envelope: message.envelope,
        referenceId,
        collectionPrefix,
      });
    }

    const sortedMessages = messageList.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    for (let message of sortedMessages) {
      const { referenceId, collectionPrefix, source } = message;
      const collectionName = determineCollectionName(collectionPrefix);
      if (referenceId) {
        await updateContribution(
          referenceId,
          await processEmailContent(source),
          message.date,
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
  const collections: Record<string, string> = {
    "remove-user": "remove-user",
    contacts: "contacts",
    contribute: "contribute",
    contribute_productions: "contribute_productions",
    "update-user-data": "update-user-data",
    bso: "local_variations",
    local_variations: "local_variations",
  };
  console.log(collections[collectionPrefix]);
  return collections[collectionPrefix] || "contacts";
}

process.env.APP_ENV === "production" || process.env.APP_ENV === "staging"
  ? setInterval(() => {
      console.log("Vérification des emails...");
      fetchEmails().catch(console.error);
    }, 200 * 500)
  : console.log("Not in production mode, skipping email fetching");

export const getReceivedMailsRoutes = new Elysia();

getReceivedMailsRoutes.use(lastReceivedMail);

export default getReceivedMailsRoutes;
