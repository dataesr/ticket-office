import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { editContributionsSchema } from "../../../schemas/patch/editSchema";
import { contactSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";

type contactType = Static<typeof contactSchema>;
const contactPutRoutes = new Elysia();

contactPutRoutes.patch(
  "/contact/:id",
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
      .collection("contact")
      .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } });

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" });
    }

    const updatedContact = await db
      .collection("contact")
      .findOne<contactType>({ id });
    if (!updatedContact) {
      return error(404, { message: "Contact non trouvé" });
    }

    const responseContact = {
      id: updatedContact.id,
      organisation: updatedContact.organisation,
      fromApp: updatedContact.fromApp,
      name: updatedContact.name,
      email: updatedContact.email,
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
      200: contactSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Modifier une contribution via formulaire de contact par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, l'idref, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contact"],
    },
  }
);

export default contactPutRoutes;
