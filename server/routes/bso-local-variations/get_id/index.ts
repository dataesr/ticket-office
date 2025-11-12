import { Elysia } from "elysia"
import { ObjectId } from "mongodb"

import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import {
  variationParams,
  variationSchema,
} from "../../../schemas/get_id/variationSchema"

type variationType = typeof variationSchema.static

const getBsoLocalVariationsByIdRoute = new Elysia().get(
  "/bso-local-variations-publications/:api/:id",
  async ({ params: { api, id }, set }) => {
    try {
      const collection = `bso_local_variations_${api}`
      const variation = await db.collection(collection).findOne<variationType>({
        _id: new ObjectId(id),
      })

      if (!variation) {
        set.status = 404
        return { message: "Une erreur s'est produite" }
      }

      return variation
    } catch (error) {
      set.status = 500
      return { message: "Failed to fetch variation" }
    }
  },
  {
    params: variationParams,
    response: {
      200: variationSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir une déclinaison locale via son ID",
      description:
        "Cette route retourne les détails d'une déclinaison locale spécifique via l'ID fourni.",
      tags: ["Déclinaisons locales"],
    },
  }
)

export default getBsoLocalVariationsByIdRoute
