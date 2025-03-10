import Elysia, { Static } from "elysia"
import { variationSchema } from "../../../schemas/get_id/variationSchema"
import db from "../../../libs/mongo"
import { ObjectId } from "mongodb"
import { errorSchema } from "../../../schemas/errors/errorSchema"

type variationType = Static<typeof variationSchema>

const getVariationByIdRoute = new Elysia()

getVariationByIdRoute.get(
  "/variations/:id",
  async ({ params: { id } }) => {
    console.log("id", id, typeof id)
    const variation = await db
      .collection("local_variations")
      .findOne<variationType>({
        _id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch variation"))
    if (!variation) return { message: "Une erreur s'est produite" }
    return variation
  },
  {
    response: {
      200: variationSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir une déclinaison locale via son ID",
      description: "Cette route retourne les détails d'une déclinaison locale spécifique via l'ID fourni.",
      tags: ["Déclinaisons locales"],
    },
  }
)

export default getVariationByIdRoute
