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
    cleanedText = cleanedText.replace(
      base64Pattern,
      "[Contenu binaire ignoré]"
    );
  }

  const citationMarkers = [
    "Le mer.",
    "Le mar.",
    "Le lun.",
    "Le jeu.",
    "Le ven.",
    "Le sam.",
    "Le dim.",
    "écrit :",
    "wrote:",
    "> ",
    "From:",
    "De :",
    "-----Original Message",
    "--",
    "L'équipe scanR vous remercie",
  ];

  let messageLines = cleanedText.split("\n");
  let firstMeaningfulLines = [];
  let foundCitation = false;

  for (const line of messageLines) {
    if (citationMarkers.some((marker) => line.trim().includes(marker))) {
      foundCitation = true;
      break;
    }
    if (line.trim() !== "") {
      firstMeaningfulLines.push(line.trim());
    }
  }

  if (firstMeaningfulLines.length === 0 && messageLines.length > 0) {
    for (const line of messageLines) {
      if (line.trim() !== "") {
        firstMeaningfulLines.push(line.trim());
        break;
      }
    }
  }

  return firstMeaningfulLines.join(" ").trim();
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

  const textToUse =
    extractedText ||
    (envelope?.extractedText ? envelope.extractedText : "Pas de contenu");

  const mattermostMessage = `
🚀 **Bip...Bip**  
📩 **Nouvelle réponse de ${senderName}** le ${new Date().toLocaleString(
    "fr-FR"
  )}
**Extrait du message :**
${textToUse.substring(0, 100)}...

🔗 [Voir la contribution complète](${contributionLink})
`;

  try {
    await sendMattermostNotification(mattermostMessage);
    console.log(`✅ Notification Mattermost envoyée pour ${referenceId}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Erreur notification Mattermost pour ${referenceId}:`,
      error
    );
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
    subject: `Réponse de ${envelope.from[0].name} à votre message`,
    templateId: emailConfig.templateId,
    params: {
      date: new Date().toLocaleDateString("fr-FR"),
      title: "Nouvelle réponse à une contribution",
      extractedText: extractedText.substring(0, 100),
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

  try {
    await client.connect();

    let lock = await client.getMailboxLock("INBOX");
    try {
      const messages = await client.fetch("1:*", {
        source: true,
        envelope: true,
        uid: true,
      });

      const messageList: {
        uid: number;
        date: string;
        source: string;
        envelope: any;
        referenceId: string | null;
        collectionName: string;
      }[] = [];

      const processedUids: number[] = [];

      for await (let message of messages) {
        if (!message.envelope || !message.source || !message.uid) continue;

        const messageSource = message.source.toString();
        const date = formatDate(message.envelope.date?.toISOString() || null);
        const subject = message.envelope.subject || "";

        const extractedContent = await processEmailContent(messageSource);
        if (!extractedContent) continue;

        const { referenceId, collectionName } = extractReferenceInfo(subject);

        const saved = await saveReceivedEmail(
          message.envelope,
          messageSource,
          extractedContent,
          date,
          referenceId || undefined,
          collectionName || undefined
        );

        if (!saved) {
          processedUids.push(message.uid);
          continue;
        }

        if (referenceId) {
          const finalCollectionName =
            collectionName === "needs_lookup"
              ? await lookupCorrectCollection(referenceId)
              : collectionName;

          messageList.push({
            uid: message.uid,
            date,
            source: messageSource,
            envelope: message.envelope,
            referenceId,
            collectionName: finalCollectionName,
          });
        } else {
          processedUids.push(message.uid);
        }
      }

      const sortedMessages = messageList.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      for (let message of sortedMessages) {
        const { uid, referenceId, collectionName, source, envelope } = message;
        if (referenceId) {
          const extractedText = await processEmailContent(source);
          const contribution = await updateContribution(
            referenceId,
            extractedText,
            message.date,
            collectionName
          );

          if (contribution) {
            let toAddress = "";
            if (envelope && envelope.to && envelope.to.length > 0) {
              toAddress = envelope.to[0].address || "";
            }

            await senderToMattermostNotifications(
              referenceId,
              contribution,
              collectionName,
              envelope,
              extractedText
            );

            await sendNotificationEmail(
              referenceId,
              contribution,
              collectionName,
              toAddress,
              extractedText,
              envelope
            );

            // Marquer comme traité (normalement)
            processedUids.push(uid);
          }
        }
      }

      if (processedUids.length > 0) {
        try {
          const mailboxes = await client.list();

          let trashPath = "Trash";

          const ovhTrash = mailboxes.find(
            (box) =>
              box.path === "INBOX.INBOX.Trash" || box.path === "INBOX.Trash"
          );

          if (ovhTrash) {
            trashPath = ovhTrash.path;
          } else {
            const trashMailbox = mailboxes.find(
              (box) =>
                box.specialUse === "\\Trash" ||
                box.path.toLowerCase().includes("trash") ||
                box.path.toLowerCase().includes("corbeille")
            );

            if (trashMailbox) {
              trashPath = trashMailbox.path;
            }
          }

          console.log(
            `🗑️ Déplacement de ${processedUids.length} emails vers ${trashPath}...`
          );
          await client.messageMove(processedUids, trashPath);
          console.log(
            `✅ ${processedUids.length} emails déplacés vers la corbeille`
          );
        } catch (moveError) {
          console.error("❌ Erreur lors du déplacement des emails:", moveError);
          console.error(moveError);
        }
      }
    } finally {
      if (lock) lock.release();
    }
  } catch (error) {
    console.error("❌ Erreur lors de la vérification des emails:", error);
  } finally {
    try {
      await client.logout();
    } catch (logoutError) {
      console.error("❌ Erreur lors de la déconnexion:", logoutError);
    }
  }
}
