import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postUpdateUserDataSchema } from "../../../schemas/post/UpdateUserDataSchema";
import { ObjectId } from "mongodb";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { updateDatasSchema } from "../../../schemas/get/updateDatasSchema";
import { emailRecipients } from "../../contacts/post/emailRecipents";
import { newContributionEmailConfig } from "../../../utils/configEmail";
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification";

type postUpdateUserDataSchemaType = Static<typeof postUpdateUserDataSchema>;

const postUpdateUserDataRoutes = new Elysia();

postUpdateUserDataRoutes.post(
  "/update-user-data",
  async ({
    error,
    body,
  }: {
    error: any;
    body: postUpdateUserDataSchemaType;
  }) => {
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {} as { [key: string]: string }
    );

    const _id = new ObjectId();
    const newContribution = {
      ...body,
      _id,
      extra: extraLowercase,
      id: _id.toHexString(),
      created_at: new Date(),
      status: "new",
    };

    const result = await db
      .collection("update-user-data")
      .insertOne(newContribution);

    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    const url = process.env.BASE_API_URL;
    const contributionLink = `${url}/scanr-namechange?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return error(500, {
        message: "BREVO_API_KEY is not defined",
        code: "MISSING_API_KEY",
      });
    }

    const recipients = emailRecipients["update-user-data"] || {
      to: process.env.SCANR_EMAIL_RECIPIENTS?.split(",") || [],
    };
    const selectedConfig = newContributionEmailConfig.scanr;

    const fonction = finalContribution.extra?.fonction || "non renseigné";
    const dataForBrevo = {
      sender: {
        email: selectedConfig.senderEmail,
        name: selectedConfig.senderName,
      },
      to: recipients.to.map((email) => ({ email, name: email.split("@")[0] })),
      replyTo: {
        email: selectedConfig.replyToEmail,
        name: selectedConfig.replyToName,
      },
      subject: "Nouvelle demande de modification de profil",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        title: "Nouvelle demande de modification de profil",
        id: finalContribution.id,
        link: contributionLink,
        name: finalContribution.name,
        email: finalContribution.email,
        fonction: fonction,
        message: `${finalContribution.message}`,
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
      return error(500, {
        message: `Erreur d'envoi d'email: ${response.statusText}`,
        code: "EMAIL_SEND_FAILED",
      });
    }

    const mattermostMessage = `:mega: 🚀 Bip...Bip - Nouvelle demande de mise à jour sur scanR ! 
        **Nom**: ${finalContribution.name}  
        **Email**: ${finalContribution.email}  
       🔗 [Voir la contribution](${contributionLink})`;

    await sendMattermostNotification(mattermostMessage);

    return finalContribution;
  },
  {
    body: postUpdateUserDataSchema,
    response: {
      200: updateDatasSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de demande de mise à jour de données utilisateur",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
);

export default postUpdateUserDataRoutes;
