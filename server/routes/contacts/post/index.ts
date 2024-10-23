import Elysia, { Static } from "elysia";
import { postContactSchema } from "../../../schemas/post/contactSchema";
import db from "../../../libs/mongo";
import { contactSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { ObjectId } from "mongodb";
import { emailRecipients } from "./emailRecipents";

type postContactSchemaType = Static<typeof postContactSchema>;

const postContactsRoutes = new Elysia();
postContactsRoutes.post(
  "/contacts",
  async ({ error, body }: { error: any; body: postContactSchemaType }) => {
    const allowedFromApps = [
      "paysage",
      "scanr",
      "bso",
      "works-magnet",
      "datasupr",
      "curiexplore",
    ];

    if (!allowedFromApps.includes(body.fromApplication)) {
      return error(400, {
        message: "Invalid fromApplication value, check child attributes",
        code: "INVALID_FROM_APP",
      });
    }

    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {}
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
      return error(500, {
        message: "Failed to create the contribution",
        code: "INSERTION_FAILED",
      });
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };
    const url = process.env.BASE_API_URL;
    const contributionLink = `${url}/${body.fromApplication}-contact?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return error(500, {
        message: "BREVO_API_KEY is not defined",
        code: "MISSING_API_KEY",
      });
    }

    const recipients = emailRecipients[body.fromApplication];
    if (!recipients) {
      return error(400, {
        message: "No email recipients found for this application",
        code: "NO_RECIPIENTS_FOUND",
      });
    }

    const dataForBrevo = {
      sender: {
        email: process.env.MAIL_SENDER,
        name: "L'équipe scanR",
      },
      to: recipients.to.map((email) => ({ email, name: email.split("@")[0] })),
      replyTo: { email: "support@scanr.fr", name: "L'équipe scanR" },
      subject: "Nouvelle contribution créée",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        title: "Nouvelle contribution créée via formulaire de contact",
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
