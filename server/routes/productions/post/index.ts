<<<<<<< HEAD
<<<<<<< HEAD
import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postProductionsSchema } from "../../../schemas/post/productionsSchema";
import { productionSchema } from "../../../schemas/get/productionSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { ObjectId } from "mongodb";
<<<<<<< HEAD
import { emailRecipients } from "../../contacts/post/emailRecipents";
=======
import Elysia, { Static, t } from "elysia";
=======
import Elysia, { Static } from "elysia";
>>>>>>> 2e9190f (fix(api): update schemas)
import db from "../../../libs/mongo";
import { postProductionsSchema } from "../../../schemas/post/productionsSchema";
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import { productionSchema } from "../../../schemas/get/productionSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
>>>>>>> 2e9190f (fix(api): update schemas)
=======
>>>>>>> b05991b (fix(api): update schemas)

type postProductionSchemaType = Static<typeof postProductionsSchema>;

const postProductionRoutes = new Elysia();

postProductionRoutes.post(
  "/production",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  async ({ error, body }: { error: any; body: postProductionSchemaType }) => {
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
=======
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

=======
  async ({ error, body }: { error: any; body: any }) => {
>>>>>>> 2e9190f (fix(api): update schemas)
    const productionData = {
=======
  async ({ error, body }: { error: any; body: postProductionSchemaType }) => {
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {}
    );

    const newContribution = {
>>>>>>> b05991b (fix(api): update schemas)
      ...body,
      id: new ObjectId().toHexString(),
      created_at: new Date(),
      status: "new",
<<<<<<< HEAD
<<<<<<< HEAD
      productions: productionData.productions || [],
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> b05991b (fix(api): update schemas)
=======
      extra: extraLowercase,
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    };

    const result = await db
      .collection("contribute_productions")
<<<<<<< HEAD
<<<<<<< HEAD
      .insertOne(newContribution);

    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
    }

<<<<<<< HEAD
    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    const contributionLink = `https://ticket-office.staging.dataesr.ovh/scanr-apioperations?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return error(500, {
        message: "BREVO_API_KEY is not defined",
        code: "MISSING_API_KEY",
      });
    }

    const recipients = emailRecipients["contribute_productions"] || {
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
      subject: "Nouvelle contribution d'affiliation de publication",
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
=======
      .insertOne(newContact);
=======
      .insertOne(newContribution);
>>>>>>> b05991b (fix(api): update schemas)

    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
    }

<<<<<<< HEAD
    return newContact;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
    if (body.collectionName !== "contribute_productions") {
      return error(
        400,
        "Invalid collectionName value. Must be 'contribute_productions'"
      );
    }

=======
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    return finalContribution;
>>>>>>> b05991b (fix(api): update schemas)
  },
  {
    body: postProductionsSchema,
    response: {
<<<<<<< HEAD
<<<<<<< HEAD
      200: productionSchema,
      401: errorSchema,
      500: errorSchema,
=======
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
      200: productionSchema,
      401: errorSchema,
      500: errorSchema,
>>>>>>> 2e9190f (fix(api): update schemas)
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de liaison de productions",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Production"],
    },
  }
);

export default postProductionRoutes;
