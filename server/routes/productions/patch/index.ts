import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { productionSchema } from "../../../schemas/get/productionSchema";
import { editContributionSchema } from "../../../schemas/patch_id/editContributionSchema";

type productionType = Static<typeof productionSchema>;
const productionsPutRoutes = new Elysia();

productionsPutRoutes.patch(
  "/production/:id",
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
      .collection("contribute_productions")
      .updateOne({ id }, { $set: { ...body, updatedAt: new Date() } });

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" });
    }

    const updatedObjectContribution = await db
      .collection("contribute_productions")
      .findOne<productionType>({ id });
    if (!updatedObjectContribution) {
      return error(404, { message: "Contact non trouvé" });
    }

    const responseObjectContribution = {
      id: updatedObjectContribution.id,
      objectId: updatedObjectContribution.objectId,
      name: updatedObjectContribution.name,
      email: updatedObjectContribution.email,
      status: updatedObjectContribution.status,
      team: updatedObjectContribution.team,
      modified_at: updatedObjectContribution.modified_at,
      extra: updatedObjectContribution.extra || {},
      productions: updatedObjectContribution.productions || [],
      contributionType: updatedObjectContribution.contributionType,
    };

    return responseObjectContribution;
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editContributionSchema,
    response: {
      200: productionSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Modifier une contribution via formulaire de liaison de productions par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni.",
      tags: ["Production"],
    },
  }
);

export default productionsPutRoutes;
