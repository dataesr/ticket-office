import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { updateDatasSchema } from "../../../schemas/get/updateDatasSchema";
import { editContributionsSchema } from "../../../schemas/patch/editSchema";

type updateUserDataType = Static<typeof updateDatasSchema>;
const updateUserDataPutRoutes = new Elysia();

updateUserDataPutRoutes.patch(
  "/update-user-data/:id",
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
>>>>>>> 2e9190f (fix(api): update schemas)
    const { acknowledged } = await db
      .collection("update-user-data")
      .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } });

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" });
    }

    const updatedContact = await db
      .collection("update-user-data")
      .findOne<updateUserDataType>({ id });
    if (!updatedContact) {
      return error(404, { message: "Contact non trouvé" });
    }

    const responseContact = {
      id: updatedContact.id,
<<<<<<< HEAD
<<<<<<< HEAD
=======
      organisation: updatedContact.organisation,
>>>>>>> 2e9190f (fix(api): update schemas)
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
      name: updatedContact.name,
      message: updatedContact.message,
      email: updatedContact.email,
      status: updatedContact.status,
      team: updatedContact.team,
<<<<<<< HEAD
<<<<<<< HEAD
      extra: updatedContact.extra || {},
=======
>>>>>>> 2e9190f (fix(api): update schemas)
=======
      extra: updatedContact.extra || {},
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
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
      200: updateDatasSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Modifier une contribution via formulaire de mise à jour de donnée par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
);

export default updateUserDataPutRoutes;
