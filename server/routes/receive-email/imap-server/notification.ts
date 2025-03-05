import { sendMattermostNotification } from "../../../utils/sendMattermostNotification";
import { generateContributionLink } from "./utils";

export async function sendNotificationEmail(
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
      name: "L'équipe Ticket Office",
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

export async function sendNotifications(
  referenceId: string,
  contribution: any,
  collectionName: string
): Promise<void> {
  if (!contribution.email || !contribution.id) {
    console.error(`Invalid contribution data for ID: ${referenceId}`);
    return;
  }

  const contributionLink = generateContributionLink(
    referenceId,
    contribution.fromApplication || "",
    collectionName
  );
  console.log(contribution);
  const extractedText =
    contribution.extractedText || "Aucun contenu disponible";

  const senderName = contribution.from.name || "Expéditeur inconnu";

  const mattermostMessage = `
### Bip...Bip - Nouvelle réponse de ${senderName}

${extractedText.substring(0, 500)}${extractedText.length > 500 ? "..." : ""}

[Voir la contribution complète](${contributionLink})`;

  await Promise.all([
    sendMattermostNotification(mattermostMessage),
    sendNotificationEmail(referenceId, contribution, collectionName),
  ]);
}
