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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ca679c1 (feat(imap-server): add imap server)
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

<<<<<<< HEAD
=======
>>>>>>> 2e9190f (fix(api): update schemas)
=======
>>>>>>> ca679c1 (feat(imap-server): add imap server)
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
<<<<<<< HEAD
<<<<<<< HEAD
      extra: updatedContact.extra || {},
=======
>>>>>>> 2e9190f (fix(api): update schemas)
=======
      extra: updatedContact.extra || {},
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
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
<<<<<<< HEAD
<<<<<<< HEAD
      tags: ["Suppression de profil"],
=======
      tags: ["Supression de profil"],
>>>>>>> 2e9190f (fix(api): update schemas)
=======
      tags: ["Suppression de profil"],
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    },
  }
);

export default removeUserPutRoutes;
