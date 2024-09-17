<<<<<<< HEAD
import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postRemoveUserSchema } from "../../../schemas/post/removeUserSchema";
import { ObjectId } from "mongodb";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts";
import { emailRecipients } from "../../contacts/post/emailRecipents";
=======
import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { validateQueryParams } from "../../../utils/queryValidator";
import { postRemoveUserSchema } from "../../../schemas/post/removeUserSchema";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

type postRemoveUserSchemaType = Static<typeof postRemoveUserSchema>;

const postRemoveUserRoutes = new Elysia();

postRemoveUserRoutes.post(
  "/remove-user",
<<<<<<< HEAD
  async ({ error, body }: { error: any; body: postRemoveUserSchemaType }) => {
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

    const result = await db
      .collection("remove-user")
      .insertOne(newContribution);

    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    const contributionLink = `https://ticket-office.staging.dataesr.ovh/scanr-removeuser?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return error(500, {
        message: "BREVO_API_KEY is not defined",
        code: "MISSING_API_KEY",
      });
    }

    const recipients = emailRecipients["remove-user"] || {
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
      subject: "Nouvelle demande de suppression de profil",
      templateId: 268,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        message: `La demande avec l'ID ${finalContribution.id} a été ajoutée. Vous pouvez consulter la contribution en cliquant sur le lien suivant : <a href="${contributionLink}">Consulter la contribution</a>`,
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
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

    const removeUserData = {
      ...body,
    };
    const newDeletation: postRemoveUserSchemaType = {
      email: removeUserData.email,
      name: removeUserData.name,
      message: removeUserData.message,
      organisation: removeUserData.organisation || "",
      collectionName: removeUserData.collectionName || "",
      fonction: removeUserData.fonction || "",
      created_at: new Date(),
      idref: removeUserData.idref || "",
      status: removeUserData.status || "new",
    };

    const result = await db.collection("remove-user").insertOne(newDeletation);

    if (!result.acknowledged) {
      return error(500, "Failed to create contribution");
    }

    return newDeletation;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  },
  {
    body: postRemoveUserSchema,
    response: {
<<<<<<< HEAD
      200: deleteSchema,
      401: errorSchema,
      500: errorSchema,
=======
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    },
    detail: {
      summary: "Créer une nouvelle demande de suppression de profil",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Supression de profil"],
    },
  }
);

export default postRemoveUserRoutes;
