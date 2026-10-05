import { Elysia } from "elysia";
import { postContactSchema } from "../../../schemas/post/contactSchema";
import db from "../../../libs/mongo";
import { contactSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { ObjectId } from "mongodb";
import { emailRecipients } from "./emailRecipents";
import { newContributionEmailConfig } from "../../../utils/configEmail";
import { sendMattermostNotification } from "../../../utils/sendMattermostNotification";
import { sendBrevoEmail } from "../../../utils/brevo";

type postContactSchemaType = typeof postContactSchema.static;

const postContactsRoutes = new Elysia().post(
  "/contacts",
  async ({ set, body }) => {
    const allowedFromApps = [
      "paysage",
      "scanr",
      "bso",
      "works-magnet",
      "tableaux",
      "curiexplore",
    ];

    if (!allowedFromApps.includes(body.fromApplication)) {
      set.status = 400;
      return {
        message: "Invalid fromApplication value, check child attributes",
        code: "INVALID_FROM_APP",
      };
    }

    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? (body.extra as any)[key].toLowerCase() : "",
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

    const result = await db.collection("contacts").insertOne(newContribution);
    if (!result.insertedId) {
      set.status = 500;
      return {
        message: "Failed to create the contribution",
        code: "INSERTION_FAILED",
      };
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };
    const url = process.env.BASE_API_URL;
    const contributionLink = `${url}/${body.fromApplication}-contact?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

    const recipients = emailRecipients[body.fromApplication];
    if (!recipients) {
      set.status = 400;
      return {
        message: "No email recipients found for this application",
        code: "NO_RECIPIENTS_FOUND",
      };
    }

    const selectedConfig =
      newContributionEmailConfig[
        body.fromApplication as keyof typeof newContributionEmailConfig
      ];

    if (!selectedConfig) {
      set.status = 400;
      return {
        message: `No email configuration found for ${body.fromApplication}`,
        code: "EMAIL_CONFIG_NOT_FOUND",
      };
    }

    const fonction = finalContribution.extra?.fonction || "non renseigné";
    const dataForBrevo = {
      sender: {
        email: selectedConfig.senderEmail,
        name: selectedConfig.senderName,
      },
      to: recipients.to.map((email) => ({
        email,
        name: email.split("@")[0],
      })),
      replyTo: {
        email: selectedConfig.replyToEmail,
        name: selectedConfig.replyToName,
      },
      subject: "Nouvelle contribution créée",
      templateId: selectedConfig.templateId,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        title: `Nouvelle contribution créée via formulaire de contact ${body.fromApplication.toUpperCase()}`,
        name: finalContribution.name,
        email: finalContribution.email,
        fonction: fonction,
        id: finalContribution.id,
        link: contributionLink,
        message: `${finalContribution.message}`,
      },
    };

    if (!selectedConfig.senderEmail) {
      console.error(
        `Email d'expéditeur non défini pour ${body.fromApplication}`
      );
      set.status = 500;
      return {
        message: `Configuration d'email incomplète pour ${body.fromApplication}`,
        code: "EMAIL_CONFIG_INCOMPLETE",
      };
    }

    await sendBrevoEmail(dataForBrevo);

    const subApplication = finalContribution.extra?.subApplication;
    const titleSuffix = subApplication ? ` concernant ${subApplication}` : "";
    const appName =
      body.fromApplication.charAt(0).toUpperCase() +
      body.fromApplication.slice(1);
    const mattermostMessage = `:mega: 🚀 Bip...Bip - Nouvelle contribution créée pour ${appName}${titleSuffix}
**Nom**: ${finalContribution.name}
**Email**: ${finalContribution.email}
**Fonction**: ${finalContribution.extra?.fonction || "non renseigné"}
🔗 [Voir la contribution](${contributionLink})`;

    await sendMattermostNotification(mattermostMessage);

    return finalContribution;
  },
  {
    body: postContactSchema,
    response: {
      200: contactSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Créer une nouvelle contribution",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via un formulaire de contact.",
      tags: ["Contacts"],
    },
  }
);

export default postContactsRoutes;
