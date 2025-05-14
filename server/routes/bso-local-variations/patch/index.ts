import { dot } from "dot-object"
import Elysia, { Static } from "elysia"

import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { variationListSchema } from "../../../schemas/get/variationsSchema"
import { editVariationsSchema } from "../../../schemas/patch/editVariationsSchema"
import { variationParams } from "../../../schemas/get_id/variationSchema"

const patchBsoLocalVariationsRoute = new Elysia()

patchBsoLocalVariationsRoute.patch(
  "/bso-local-variations/:api",
  async ({ body, params: { api }, error }) => {
    const { ids, data } = body

    if (data.status === "treated") {
      data.treated_at = new Date()
    }

    const collection = `bso_local_variations_${api}`
    const { acknowledged } = await db
      .collection(collection)
      .updateMany({ id: { $in: ids } }, { $set: { ...dot(data), modified_at: new Date() } })

    if (!acknowledged) {
      return error(500, { message: "Erreur interne du serveur" })
    }

    const updatedVariations: unknown = await db
      .collection(collection)
      .find({ id: { $in: ids } })
      .limit(Math.min(ids.length, 2000))
      .toArray()

    return updatedVariations as Static<typeof variationListSchema>
  },
  {
    body: editVariationsSchema,
    params: variationParams,
    response: {
      200: variationListSchema,
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

export default patchBsoLocalVariationsRoute
