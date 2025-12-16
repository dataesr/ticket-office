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

export async function processEmailContent(messageSource: string): Promise<{
  text: string;
  images: Record<string, { contentType: string; base64: string }>;
}> {
  try {
    const parsed = await simpleParser(messageSource);
    const bodyText = parsed.text || parsed.html || "";
    const images: Record<string, { contentType: string; base64: string }> = {};

    if (parsed.attachments && parsed.attachments.length > 0) {
      console.log(
        `🔍 Traitement de ${parsed.attachments.length} pièces jointes`
      );

      for (const attachment of parsed.attachments) {
        const isImage =
          attachment.contentType?.startsWith("image/") ||
          /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(attachment.filename || "");

        if (isImage && attachment.content) {
          let imageId;

          if (attachment.contentId) {
            imageId = attachment.contentId.replace(/[<>]/g, "");
          } else if (attachment.filename) {
            imageId = attachment.filename.replace(/[^a-zA-Z0-9_-]/g, "_");
          } else {
            imageId = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
          }

          const base64Data = Buffer.isBuffer(attachment.content)
            ? attachment.content.toString("base64")
            : typeof attachment.content === "string"
            ? Buffer.from(attachment.content).toString("base64")
            : Buffer.from(String(attachment.content || "")).toString("base64");

          images[imageId] = {
            contentType: attachment.contentType || "application/octet-stream",
            base64: base64Data,
          };
        }
      }
    } else {
      console.log("⚠️ Aucune pièce jointe trouvée dans l'email");
    }

    if (!bodyText) {
      return { text: "", images };
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

    if (Object.keys(images).length > 0) {
      for (const [key, img] of Object.entries(images)) {
        console.log(
          `📷 Image ${key}: ${img.contentType}, taille base64=${img.base64.length}`
        );
      }
    }

    return {
      text: firstMeaningfulLines.join(" ").trim(),
      images,
    };
  } catch (error) {
    console.error("❌ Erreur dans processEmailContent:", error);
    return { text: "Erreur lors du traitement de l'email", images: {} };
  }
}

export async function senderToMattermostNotifications(
  referenceId: string,
  contribution: any,
  collectionName: string,
  envelope: any = null,
  extractedText: string = ""
): Promise<boolean> {
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
  if (!contribution?.email || !contribution?.id) {
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
    let mailbox = await client.mailboxOpen("INBOX");
    await client.messageDelete({ seen: true });

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

      for await (let message of messages) {
        if (!message.envelope || !message.source || !message.uid) continue;

        const messageSource = message.source.toString();
        const date = formatDate(message.envelope.date?.toISOString() || null);
        const subject = message.envelope.subject || "";
        const processedContent = await processEmailContent(messageSource);
        console.log(processedContent);
        if (!processedContent.text) continue;

        const { referenceId, collectionName } = extractReferenceInfo(subject);

        const saved = await saveReceivedEmail(
          message.envelope,
          messageSource,
          processedContent,
          date,
          referenceId || undefined,
          collectionName || undefined
        );

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
          const senderName =
            message.envelope.from && message.envelope.from.length > 0
              ? message.envelope.from[0].name ||
                message.envelope.from[0].address
              : "Expéditeur inconnu";
          const textToUse = processedContent.text || "Pas de contenu";
          const mattermostMessage = `
🚨 **Mail non suivi**
📩 **Nouveau mail de ${senderName}** le ${date}
**Extrait du message :**
${textToUse.substring(0, 100)}...
`;
          try {
            await sendMattermostNotification(mattermostMessage);
          } catch (error) {
            console.error(
              "❌ Erreur notification Mattermost pour mail non suivi:",
              error
            );
          }
        }
      }

      const sortedMessages = messageList.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      for (let message of sortedMessages) {
        const { uid, referenceId, collectionName, source, envelope } = message;
        if (referenceId) {
          const processedContent = await processEmailContent(source);
          const contribution = await updateContribution(
            referenceId,
            processedContent,
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
              processedContent.text
            );

            await sendNotificationEmail(
              referenceId,
              contribution,
              collectionName,
              toAddress,
              processedContent.text,
              envelope
            );
          }
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
