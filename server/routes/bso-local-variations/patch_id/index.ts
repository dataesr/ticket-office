import { dot } from "dot-object"
import { Elysia } from "elysia"

import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import {
  variationParams,
  variationSchema,
} from "../../../schemas/get_id/variationSchema"
import { editVariationSchema } from "../../../schemas/patch_id/editVariationSchema"

type variationType = typeof variationSchema.static

const patchBsoLocalVariationsByIdRoute = new Elysia().patch(
  "/bso-local-variations/:api/:id",
  async ({ body, params: { api, id }, set }) => {
    if (body?.status === "treated") {
      body.treated_at = new Date()
    }

    const collection = `bso_local_variations_${api}`
    const { acknowledged } = await db
      .collection(collection)
      .updateOne({ id }, { $set: { ...dot(body), modified_at: new Date() } })

    if (!acknowledged) {
      return (set.status = 500), { message: "Erreur interne du serveur" }
    }

    const updatedVariation = await db
      .collection(collection)
      .findOne<variationType>({ id })
    if (!updatedVariation) {
      return (set.status = 404), { message: "Déclinaison locale non trouvée" }
    }

    return updatedVariation
  },
  {
    body: editVariationSchema,
    params: variationParams,
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

export default patchBsoLocalVariationsByIdRoute
