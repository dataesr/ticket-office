import  { Elysia, t } from "elysia";
import db from "../../../libs/mongo";
import { editContributionSchema } from "../../../schemas/patch_id/editContributionSchema";
import { contactSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";

type contactType = typeof contactSchema.static;
const contactPutRoutes = new Elysia();

contactPutRoutes.patch(
  "/contacts/:id",
  async ({ params: { id }, body, set }) => {
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
      body.threads = body.threads.map((thread: { responses: any[]; }) => {
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
      .collection("contacts")
      .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } });

    if (!acknowledged) {
      return set.status = 500, { message: "Erreur interne du serveur" };
    }

    const updatedContact = await db
      .collection("contacts")
      .findOne<contactType>({ id });
    if (!updatedContact) {
      return set.status = 404, { message: "Contact non trouvé" };
    }

    const responseContact = {
      id: updatedContact.id,
      fromApplication: updatedContact.fromApplication,
      name: updatedContact.name,
      email: updatedContact.email,
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
      200: contactSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Modifier une contribution via formulaire de contact par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contacts"],
    },
  }
);

export default contactPutRoutes;
