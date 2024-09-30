<<<<<<< HEAD
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
=======
import Elysia, { Static } from "elysia";
>>>>>>> 2e9190f (fix(api): update schemas)
import db from "../../../libs/mongo";
import { postContributionObjectSchema } from "../../../schemas/post/contributionByObject";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { contributionObjectSchema } from "../../../schemas/get/contributionsObjectSchema";
import { ObjectId } from "mongodb";

<<<<<<< HEAD
type postContributionObjectSchemaType = Static<typeof postContactSchema>;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
type postContributionObjectSchemaType = Static<
  typeof postContributionObjectSchema
>;
>>>>>>> 2e9190f (fix(api): update schemas)

const postContributionObjectRoutes = new Elysia();

postContributionObjectRoutes.post(
  "/contribute",
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2e9190f (fix(api): update schemas)
  async ({
    error,
    body,
  }: {
    error: any;
    body: postContributionObjectSchemaType;
  }) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {}
    );

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
=======
    const _id = new ObjectId();
>>>>>>> abc94ae (fix(send-mail): add send mail route to ui)
    const newContribution = {
      ...body,
      _id,
      extra: extraLowercase,
<<<<<<< HEAD
      id: new ObjectId().toHexString(),
>>>>>>> 2e9190f (fix(api): update schemas)
=======
      id: _id.toHexString(),
>>>>>>> abc94ae (fix(send-mail): add send mail route to ui)
      created_at: new Date(),
      status: "new",
    };

<<<<<<< HEAD
<<<<<<< HEAD
    if (!body.objectId && !body.objectType) {
      return error(400, "objectId is required when objectType is provided");
    }

    const result = await db.collection("contribute").insertOne(newContribution);

    if (!body.objectId && !body.objectType) {
      return error(400, "objectId is required when objectType is provided");
    }

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
=======
    const result = await db.collection("contribute").insertOne(newContribution);
>>>>>>> 2e9190f (fix(api): update schemas)

    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    return finalContribution;
  },
  {
    body: postContributionObjectSchema,
    response: {
<<<<<<< HEAD
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
      200: contributionObjectSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
>>>>>>> 2e9190f (fix(api): update schemas)
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
