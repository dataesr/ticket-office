<<<<<<< HEAD
import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postUpdateUserDataSchema } from "../../../schemas/post/UpdateUserDataSchema";
import { ObjectId } from "mongodb";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { updateDatasSchema } from "../../../schemas/get/updateDatasSchema";
import { emailRecipients } from "../../contacts/post/emailRecipents";

type postUpdateUserDataSchemaType = Static<typeof postUpdateUserDataSchema>;
=======
import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { postUpdateUserDataSchema } from "../../../schemas/post/UpdateUserDataSchema";
import { ObjectId } from "mongodb";

<<<<<<< HEAD
type postUpdateUserDataSchemaType = Static<typeof postRemoveUserSchema>;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
type postUpdateUserDataSchemaType = Static<typeof postUpdateUserDataSchema>;
>>>>>>> b05991b (fix(api): update schemas)

const postUpdateUserDataRoutes = new Elysia();

postUpdateUserDataRoutes.post(
  "/update-user-data",
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b05991b (fix(api): update schemas)
  async ({
    error,
    body,
  }: {
    error: any;
    body: postUpdateUserDataSchemaType;
  }) => {
<<<<<<< HEAD
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
=======
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

    const updateUserData = {
=======
    const newContribution = {
>>>>>>> b05991b (fix(api): update schemas)
      ...body,
      id: new ObjectId().toHexString(),
      created_at: new Date(),
<<<<<<< HEAD
      idref: updateUserData.idref || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> b05991b (fix(api): update schemas)
      status: "new",
    };

    const result = await db
      .collection("update-user-data")
      .insertOne(newContribution);

<<<<<<< HEAD
<<<<<<< HEAD
    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    const contributionLink = `https://ticket-office.staging.dataesr.ovh/scanr-namechange?page=1&query=${finalContribution.id}&searchInMessage=false&sort=DESC&status=choose`;

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
      subject: "Nouvelle demande de modification de profil",
      templateId: 267,
      params: {
        date: new Date().toLocaleDateString("fr-FR"),
        userResponse: "Une nouvelle demande de modification de profil.",
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
  },
  {
    body: postUpdateUserDataSchema,
    response: {
      200: updateDatasSchema,
      401: errorSchema,
      500: errorSchema,
=======
    if (!result.acknowledged) {
      return error(500, "Failed to create contribution from update-user-data");
=======
    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
>>>>>>> b05991b (fix(api): update schemas)
    }

    if (body.collectionName !== "update-user-data") {
      return error(
        400,
        "Invalid collectionName value. Must be 'update-user-data"
      );
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    return finalContribution;
  },
  {
    body: postUpdateUserDataSchema,
    response: {
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
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
