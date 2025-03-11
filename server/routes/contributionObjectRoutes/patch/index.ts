import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { editContributionSchema } from "../../../schemas/patch_id/editContributionSchema";
import { contributionObjectSchema } from "../../../schemas/get/contributionsObjectSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";

type ContributionType = Static<typeof contributionObjectSchema>;
const contributionObjectPutRoutes = new Elysia();

contributionObjectPutRoutes.patch(
  "/contribute/:id",
  async ({
    params: { id },
    body,
    error,
  }: {
    params: { id: string };
    body: any;
    error: any;
  }) => {
    const updateData = { ...body };

    if (
      updateData.status &&
      ["ongoing", "treated"].includes(updateData.status)
    ) {
      updateData.treated_at = new Date();
    }

    if (updateData.team && Array.isArray(updateData.team)) {
      const userWhoModified = updateData.team[0];
      if (!updateData.team.includes(userWhoModified)) {
        updateData.team.push(userWhoModified);
      }
    }

    if (updateData.threads) {
      updateData.threads = updateData.threads.map(
        (thread: { responses: any[] }) => {
          thread.responses = thread.responses?.map(
            (response: { read: boolean }) => {
              if (response.read === false) {
                response.read = true;
              }
              return response;
            }
          );
          return thread;
        }
      );
    }

    updateData.modified_at = new Date();

    const updateResult = await db
      .collection("contribute")
      .updateOne({ id }, { $set: updateData })
      .catch(() => null);

    if (!updateResult?.acknowledged) {
      return error(500, { message: "Erreur interne du serveur" });
    }

    const updatedDoc = await db
      .collection("contribute")
      .findOne<ContributionType>({ id })
      .catch(() => null);

    if (!updatedDoc) {
      return error(404, { message: "Contribution non trouvée" });
    }

    const completeDoc = {
      ...updatedDoc,
      comment: updatedDoc.comment || "",
      tags: updatedDoc.tags || [],
      threads: updatedDoc.threads || [],
      extra: updatedDoc.extra || {},
      contributionType: updatedDoc.contributionType || "contribute-object",
    };

    return completeDoc;
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editContributionSchema,
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
