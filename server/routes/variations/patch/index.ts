import Elysia, { Static, t } from "elysia"
import db from "../../../libs/mongo"
import { editVariationSchema } from "../../../schemas/patch/editVariationSchema"
import { variationSchema } from "../../../schemas/get_id/variationSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"

type variationType = Static<typeof variationSchema>
const variationPutRoutes = new Elysia()

variationPutRoutes.patch(
  "/variations/:id",
  async ({ params: { id }, body, error }) => {
    if (body.status && ["ongoing", "treated"].includes(body.status)) {
      body.treated_at = new Date()
    }

    if (body.team && Array.isArray(body.team)) {
      const userWhoModified = body.team[0]
      if (!body.team.includes(userWhoModified)) {
        body.team.push(userWhoModified)
      }
    }

    const { acknowledged } = await db
      .collection("local_variations")
      .updateOne({ id }, { $set: { ...body, modified_at: new Date() } })

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" })
    }

    const updatedVariation = await db.collection("local_variations").findOne<variationType>({ id })
    if (!updatedVariation) {
      return error(404, { message: "Déclinaison locale non trouvé" })
    }

    return updatedVariation
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: editVariationSchema,
    response: {
      200: variationSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Modifier une déclinaison locale via son ID",
      description:
        "Cette route permet de mettre à jour une déclinaison locale spécifique via l'ID fourni. Elle permet de modifier le statut, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Déclinaisons locales"],
    },
  }
)

export default variationPutRoutes
