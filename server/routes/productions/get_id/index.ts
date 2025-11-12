import { Elysia } from "elysia"
import db from "../../../libs/mongo"
import { ObjectId } from "mongodb"
import { productionSchema } from "../../../schemas/get/productionSchema"

type productionType = typeof productionSchema.static

const getProductionByIdRoutes = new Elysia()

getProductionByIdRoutes.get(
  "/production/:id",
  async ({ params: { id }, set }) => {
    try {
      const production = await db
        .collection("contribute_productions")
        .findOne<productionType>({
          id: new ObjectId(id),
        })

      if (!production) {
        set.status = 404
        return { message: "Une erreur s'est produite" }
      }

      return production
    } catch (error) {
      set.status = 500
      return { message: "Failed to fetch production" }
    }
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
