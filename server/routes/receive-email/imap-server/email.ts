import { ImapFlow } from "imapflow";
import * as cheerio from "cheerio";
import { simpleParser } from "mailparser";
import {
  extractReferenceInfo,
  formatDate,
  generateContributionLink,
} from "./utils";
import {
  lookupCorrectCollection,
  saveReceivedEmail,
  updateContribution,
} from "./db";
import { config } from "./config";
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification";

export async function processEmailContent(messageSource: string) {
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


export async function senderToMattermostNotifications(
  referenceId: string,
  contribution: any,
  collectionName: string,
  envelope: any = null,
  extractedText: string = ""
): Promise<boolean> {
  console.log(`🤖 Préparation notification Mattermost pour ${referenceId}`);
  
  if (!contribution || !referenceId) {
    console.error(`❌ Données invalides pour Mattermost: ${referenceId}`);
    return false;
  }

  const contributionLink = generateContributionLink(
    referenceId,
    contribution.fromApplication || "",
    collectionName
  );
  
  const senderName =
    envelope?.from && envelope.from.length > 0
      ? envelope.from[0].name || envelope.from[0].address
      : contribution.name || "Expéditeur inconnu";

  const textToUse = extractedText || 
    (envelope?.extractedText ? envelope.extractedText : "Pas de contenu");

  const mattermostMessage = `
🚀 **Bip...Bip**  
📩 **Nouvelle réponse de ${senderName}** le ${new Date().toLocaleString("fr-FR")}
**Extrait du message :**
${textToUse.substring(0, 100)}...

🔗 [Voir la contribution complète](${contributionLink})
`;

  try {
    await sendMattermostNotification(mattermostMessage);
    console.log(`✅ Notification Mattermost envoyée pour ${referenceId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur notification Mattermost pour ${referenceId}:`, error);
    return false;
  }
}

export async function sendNotificationEmail(
  referenceId: string,
  contribution: any,
  collectionName: string,
  toAddress: string = "",
  extractedText: string = "",
  envelope: any = null
): Promise<boolean> {
  console.log(`📧 Début du processus de notification pour ${referenceId}`);
  
  if (!contribution?.email || !contribution?.id) {
    console.error(`❌ Données de contribution invalides: ${referenceId}`);
    return false;
  }

  const contributionLink = generateContributionLink(
    referenceId,
    contribution.fromApplication || "",
    collectionName
  );

  const mattermostSuccess = await senderToMattermostNotifications(
    referenceId,
    contribution,
    collectionName,
    envelope,
    extractedText
  );

  let emailConfig = config.defaultConfig;
  const addressKey = toAddress.toLowerCase();

  if (
    addressKey &&
    Object.prototype.hasOwnProperty.call(config.domainConfigs, addressKey)
  ) {
    emailConfig =
      config.domainConfigs[addressKey as keyof typeof config.domainConfigs];
  }

  const emailData = {
    sender: {
      email: emailConfig.mailSender,
      name: emailConfig.senderName,
    },
    to: config.scanrEmailRecipients.map((email) => ({
      email,
      name: email.split("@")[0],
    })),
    replyTo: {
      email: emailConfig.mailSender,
      name: emailConfig.senderName,
    },
    subject: "Nouvelle réponse à une contribution",
    templateId: emailConfig.templateId,
    params: {
      date: new Date().toLocaleDateString("fr-FR"),
      title: "Nouvelle réponse à une contribution",
      url: contributionLink,
    },
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.brevoApiKey) {
    headers["api-key"] = config.brevoApiKey;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers,
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      console.error(`❌ Erreur d'envoi email: ${response.statusText}`);
      return false;
    } else {
      console.log(
        `✅ Email envoyé pour ${referenceId} via ${emailConfig.mailSender}`
      );
      return true;
    }
  } catch (error) {
    console.error(`❌ Exception lors de l'envoi email:`, error);
    return false;
  }
}

export async function fetchEmails() {
  const client = new ImapFlow({
    host: config.mailHost,
    port: 993,
    secure: true,
    auth: {
      user: config.email || "",
      pass: config.password || "",
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
      collectionName: string;
    }[] = [];

    for await (let message of messages) {
      if (!message.envelope || !message.source) continue;

      const messageSource = message.source.toString();
      const date = formatDate(message.envelope.date?.toISOString() || null);
      const subject = message.envelope.subject || "";

      const extractedContent = await processEmailContent(messageSource);
      if (!extractedContent) continue;

      const saved = await saveReceivedEmail(
        message.envelope,
        messageSource,
        extractedContent,
        date
      );

      if (!saved) continue;

      const { referenceId, collectionName } = extractReferenceInfo(subject);

      if (referenceId) {
        const finalCollectionName =
          collectionName === "needs_lookup"
            ? await lookupCorrectCollection(referenceId)
            : collectionName;

        messageList.push({
          date,
          source: messageSource,
          envelope: message.envelope,
          referenceId,
          collectionName: finalCollectionName,
        });
      }
    }

    const sortedMessages = messageList.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    for (let message of sortedMessages) {
      const { referenceId, collectionName, source, envelope } = message;
      if (referenceId) {
        const contribution = await updateContribution(
          referenceId,
          await processEmailContent(source),
          message.date,
          collectionName
        );

        if (contribution) {
          let toAddress = "";
          if (envelope && envelope.to && envelope.to.length > 0) {
            toAddress = envelope.to[0].address || "";
          }

          await sendNotificationEmail(
            referenceId,
            contribution,
            collectionName,
            toAddress
          );
        }
      }
    }
  } finally {
    lock.release();
    await client.logout();
  }
}
