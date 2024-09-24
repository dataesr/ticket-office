import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { editContributionsSchema } from "../../../schemas/patch/editSchema";
import { contributionObjectSchema } from "../../../schemas/get/contributionsObjectSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";

type ContributionType = Static<typeof contributionObjectSchema>;
const contributionObjectPutRoutes = new Elysia();

contributionObjectPutRoutes.patch(
  "/contribute/:id",
<<<<<<< HEAD
  async ({
    params: { id },
    body,
    error,
  }: {
    params: { id: string };
    body: any;
    error: any;
  }) => {
=======
  async ({ params: { id }, body, error }) => {
>>>>>>> 2e9190f (fix(api): update schemas)
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
      body.threads = body.threads.map((thread: { responses: any[] }) => {
        thread.responses = thread.responses?.map(
          (response: { read: boolean }) => {
            if (response.read === false) {
              response.read = true;
            }
            return response;
          }
        );
        return thread;
      });
    }

=======
>>>>>>> 2e9190f (fix(api): update schemas)
    const { acknowledged } = await db
      .collection("contribute")
      .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } });

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" });
    }

    const updatedObjectContribution = await db
      .collection("contribute")
      .findOne<ContributionType>({ id });
    if (!updatedObjectContribution) {
      return error(404, { message: "Contact non trouvé" });
    }

    const responseObjectContribution = {
      id: updatedObjectContribution.id,
<<<<<<< HEAD
=======
      organisation: updatedObjectContribution.organisation,
<<<<<<< HEAD
      fromApp: updatedObjectContribution.fromApp,
>>>>>>> 2e9190f (fix(api): update schemas)
=======
>>>>>>> cebb1b3 (fix(api schema): update schema, delete fromApp from inconcerned object)
      name: updatedObjectContribution.name,
      email: updatedObjectContribution.email,
      status: updatedObjectContribution.status,
      team: updatedObjectContribution.team,
      modified_at: updatedObjectContribution.modified_at,
<<<<<<< HEAD
      extra: updatedObjectContribution.extra || {},
=======
>>>>>>> 2e9190f (fix(api): update schemas)
    };

    return responseObjectContribution;
  },
  // pourquoi on envoit pas la réponse 200 ?
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editContributionsSchema,
    response: {
      200: contributionObjectSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Modifier une contribution via formulaire par objet et par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, l'idref, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contribution par objet"],
    },
  }
);

export default contributionObjectPutRoutes;
