import { Elysia, t } from "elysia"
import db from "../../../libs/mongo"
import { editContributionSchema } from "../../../schemas/patch_id/editContributionSchema"
import { contributionObjectSchema } from "../../../schemas/get/contributionsObjectSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { normalizeContributionUpdate } from "../../../utils/contributionUpdate"

type ContributionType = typeof contributionObjectSchema.static

const contributionObjectPutRoutes = new Elysia().patch(
  "/contribute/:id",
  async ({
    params: { id },
    body,
    set,
  }: {
    params: { id: string }
    body: any
    set: any
  }) => {
    const updateData = normalizeContributionUpdate({ ...body })
    updateData.modified_at = new Date()

    const updateResult = await db
      .collection("contribute")
      .updateOne({ id }, { $set: updateData })

    if (!updateResult?.acknowledged) {
      set.status = 500
      return { message: "Erreur interne du serveur" }
    }

    const updatedDoc = await db
      .collection("contribute")
      .findOne<ContributionType>({ id })

    if (!updatedDoc) {
      set.status = 404
      return { message: "Contribution non trouvée" }
    }

    const completeDoc = {
      ...updatedDoc,
      comment: updatedDoc.comment || "",
      tags: updatedDoc.tags || [],
      threads: updatedDoc.threads || [],
      extra: updatedDoc.extra || {},
      contributionType: updatedDoc.contributionType || "contribute-object",
    }

    return completeDoc
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
)

export default contributionObjectPutRoutes
