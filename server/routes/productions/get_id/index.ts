import { Elysia } from "elysia"
import db from "../../../libs/mongo"
import { ObjectId } from "mongodb"
import { productionSchema } from "../../../schemas/get/productionSchema"

type productionType = typeof productionSchema.static

const getProductionByIdRoutes = new Elysia()

getProductionByIdRoutes.get(
  "/production/:id",
  async ({ params: { id } }) => {
    const production = await db
      .collection("contribute_productions")
      .findOne<productionType>({
        id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch production"))

    if (!production) return { message: "Une erreur s'est produite" }

    return production
  },
  {
    detail: {
      summary: "Obtenir une contribution de liaison de productions par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Production"],
    },
  }
)

export default getProductionByIdRoutes
