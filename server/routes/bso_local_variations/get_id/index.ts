import Elysia, { Static } from "elysia"
import { variationSchema } from "../../../schemas/get_id/variationSchema"
import db from "../../../libs/mongo"
import { ObjectId } from "mongodb"
import { errorSchema } from "../../../schemas/errors/errorSchema"

type variationType = Static<typeof variationSchema>

const getVariationByIdRoutes = new Elysia()

getVariationByIdRoutes.get(
  "/contacts/:id",
  async ({ params: { id } }) => {
    const variation = await db
      .collection("bso_local_variation")
      .findOne<variationType>({
        id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch contact"))
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
      summary: "Obtenir une déclinaison locale via formulaire de contact par ID",
      description: "Cette route retourne les détails d'une déclinaison locale spécifique via l'ID fourni.",
      tags: ["Déclinaisons locales du BSO"],
    },
  }
)

export default getVariationByIdRoutes
