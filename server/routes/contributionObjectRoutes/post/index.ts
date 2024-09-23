<<<<<<< HEAD
import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postContributionObjectSchema } from "../../../schemas/post/contributionByObject";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { contributionObjectSchema } from "../../../schemas/get/contributionsObjectSchema";
import { ObjectId } from "mongodb";
import { emailRecipients } from "../../contacts/post/emailRecipents";

type postContributionObjectSchemaType = Static<
  typeof postContributionObjectSchema
>;
=======
import Elysia, { Static, t } from "elysia";
import { postContactSchema } from "../../../schemas/post/contactSchema";
import db from "../../../libs/mongo";
import { validateQueryParams } from "../../../utils/queryValidator";

type postContributionObjectSchemaType = Static<typeof postContactSchema>;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

const postContributionObjectRoutes = new Elysia();

postContributionObjectRoutes.post(
  "/contribute",
<<<<<<< HEAD
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
      {}
    );

    const _id = new ObjectId();
    const newContribution = {
      ...body,
      _id,
      extra: extraLowercase,
      id: _id.toHexString(),
=======
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

    const contributionData = {
      ...body,
    };
    const newContact: postContributionObjectSchemaType = {
      email: contributionData.email,
      name: contributionData.name,
      message: contributionData.message,
      organisation: contributionData.organisation || "",
      fromApp: contributionData.fromApp || "",
      collectionName: contributionData.collectionName || "",
      fonction: contributionData.fonction || "",
      idref: contributionData.idref || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
      created_at: new Date(),
      status: "new",
    };

<<<<<<< HEAD
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

    const contributionLink = `https://ticket-office.staging.dataesr.ovh/scanr-contributionPage?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

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

    const dataForBrevo = {
      sender: {
        email: process.env.MAIL_SENDER,
        name: "L'équipe scanR",
      },
      to: recipients.to.map((email: string) => ({
        email,
        name: email.split("@")[0],
      })),
      replyTo: { email: "support@scanr.fr", name: "L'équipe scanR" },
      subject: "Nouvelle contribution par objet créée",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        message: `La contribution avec l'ID ${finalContribution.id} a été ajoutée. Vous pouvez consulter la contribution en cliquant sur le lien suivant : <a href="${contributionLink}">Consulter la contribution</a>`,
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
    body: postContributionObjectSchema,
    response: {
      200: contributionObjectSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
=======
    const result = await db.collection("contribute").insertOne(newContact);

    if (!result.acknowledged) {
      return error(500, "Failed to create contribution");
    }

    return newContact;
  },
  {
    body: postContactSchema,
    response: {
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de contribution par objet",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Contribution par objet"],
    },
    example: {
      request: {
        body: {
          email: "debache.mihoub@example.com",
          name: "Debache Mihoub",
          message: "Ceci est un message de test.",
          organisation: "MESRI",
          fromApp: "paysage",
          collectionName: "contribute",
          fonction: "Développeur",
          idref: "12312321",
          status: "new",
        },
      },
    },
  }
);

export default postContributionObjectRoutes;
