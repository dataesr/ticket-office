import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { editContributionsSchema } from "../../../schemas/patch/editSchema";
import { contactSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";

type contactType = Static<typeof contactSchema>;
const contactPutRoutes = new Elysia();

contactPutRoutes.patch(
  "/contacts/:id",
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

<<<<<<< HEAD
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

=======
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    const { acknowledged } = await db
      .collection("contacts")
      .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } });

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" });
    }

    const updatedContact = await db
      .collection("contacts")
      .findOne<contactType>({ id });
    if (!updatedContact) {
      return error(404, { message: "Contact non trouvé" });
    }

    const responseContact = {
      id: updatedContact.id,
<<<<<<< HEAD
      fromApplication: updatedContact.fromApplication,
=======
      organisation: updatedContact.organisation,
      fromApp: updatedContact.fromApp,
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
      name: updatedContact.name,
      email: updatedContact.email,
      status: updatedContact.status,
      team: updatedContact.team,
      modified_at: updatedContact.modified_at,
<<<<<<< HEAD
      extra: updatedContact.extra || {},
=======
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
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
<<<<<<< HEAD
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contacts"],
=======
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, l'idref, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contact"],
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    },
  }
);

export default contactPutRoutes;
