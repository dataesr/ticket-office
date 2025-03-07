import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo.js";
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts.js";
import { editContributionSchema } from "../../../schemas/patch_id/editContributionSchema.js";
import { errorSchema } from "../../../schemas/errors/errorSchema.js";

type removeUserType = Static<typeof deleteSchema>;
const removeUserPutRoutes = new Elysia();

removeUserPutRoutes.patch(
  "/remove-user/:id",
  async ({ params: { id }, body, error }) => {
    if (body.status && ["ongoing", "treated"].includes(body.status)) {
      body.treated_at = new Date();
    }

    if (body.team && Array.isArray(body.team)) {
      const userWhoModified = body.team[0];
      if (!body.team.includes(userWhoModified)) {
        body.team.push(userWhoModified);
      }
    }

    if (body.threads) {
      body.threads = body.threads.map((thread) => {
        thread.responses = thread.responses?.map((response) => {
          if (response.read === false) {
            response.read = true;
          }
          return response;
        });
        return thread;
      });
    }

    const { acknowledged } = await db
      .collection("remove-user")
      .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } });

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" });
    }

    const updatedContact = await db
      .collection("remove-user")
      .findOne<removeUserType>({ id });
    if (!updatedContact) {
      return error(404, { message: "Contact non trouvé" });
    }

    const responseContact = {
      id: updatedContact.id,
      name: updatedContact.name,
      email: updatedContact.email,
      message: updatedContact.message,
      status: updatedContact.status,
      team: updatedContact.team,
      modified_at: updatedContact.modified_at,
      extra: updatedContact.extra || {},
      contributionType: updatedContact.contributionType,
    };

    return responseContact;
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editContributionSchema,
    response: {
      200: deleteSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Modifier une contribution sur une demande de suppression de profil par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni.",
      tags: ["Suppression de profil"],
    },
  }
);

export default removeUserPutRoutes;
