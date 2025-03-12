import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postContributionObjectSchema } from "../../../schemas/post/contributionByObject";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { contributionObjectSchema } from "../../../schemas/get/contributionsObjectSchema";
import { ObjectId } from "mongodb";
import { emailRecipients } from "../../contacts/post/emailRecipents";
import { newContributionEmailConfig } from "../../../utils/configEmail";
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification";
import {getObjectTypeLabel} from "../post/utils"

type postContributionObjectSchemaType = Static<
  typeof postContributionObjectSchema
>;

const postContributionObjectRoutes = new Elysia();

postContributionObjectRoutes.post(
  "/contribute",
  async ({
    error,
    body,
  }: {
    error: any;
    body: postContributionObjectSchemaType;
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

    if (!body.objectId && !body.objectType) {
      return error(400, "objectId is required when objectType is provided");
    }

    const result = await db.collection("contribute").insertOne(newContribution);

    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    const url = process.env.BASE_API_URL;
    const contributionLink = `${url}/scanr-contributionPage?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return error(500, {
        message: "BREVO_API_KEY is not defined",
        code: "MISSING_API_KEY",
      });
    }

    const recipients = emailRecipients["contribute"] || {
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
      subject: "Nouvelle contribution par objet créée",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        title: `Nouvelle contribution créée via formulaire de contact }`,
        name: finalContribution.name,
        email: finalContribution.email,
        fonction: fonction,
        id: finalContribution.id,
        link: contributionLink,
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

    const mattermostMessage = `:mega: 🚀 Bip...Bip - Nouvelle contribution créée pour ScanR concernant ${getObjectTypeLabel(finalContribution.objectType)}

**Nom**: ${finalContribution.name}  
**Email**: ${finalContribution.email}  
**Fonction**: ${finalContribution.extra?.fonction || "non renseigné"}  
🔗 [Voir la contribution](${contributionLink})`;

    await sendMattermostNotification(mattermostMessage);

    return finalContribution;
  },
  {
    body: postContributionObjectSchema,
    response: {
      200: contributionObjectSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de contribution par objet",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Contribution par objet"],
    },
  }
);

export default postContributionObjectRoutes;
