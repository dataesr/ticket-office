import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo.js";
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts.js";
import { editContributionsSchema } from "../../../schemas/patch/editSchema.js";
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
    };

    return responseContact;
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editContributionsSchema,
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
      tags: ["Supression de profil"],
    },
  }
);

export default removeUserPutRoutes;
