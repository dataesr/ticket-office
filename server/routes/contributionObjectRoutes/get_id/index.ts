import { Elysia, t } from "elysia"
import db from "../../../libs/mongo"
import { ObjectId } from "mongodb"
import { contactSchema } from "../../../schemas/get_id/contactSchema"

type contributionObjectType = typeof contactSchema.static

const getContributionObjectByIdRoutes = new Elysia().get(
  "/contribute/:id",
  async ({ params: { id }, set }) => {
    try {
      const contribution = await db
        .collection("contribute")
        .findOne<contributionObjectType>({
          id: new ObjectId(id),
        })

      if (!contribution) {
        set.status = 404
        return { message: "Une erreur s'est produite" }
      }

      return contribution
    } catch (error) {
      set.status = 500
      return { message: "Failed to fetch contribution" }
    }
  },
  {
    response: {
      400: t.Object({ message: t.String() }),
      401: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary:
        "Obtenir une contribution via formulaire de contribution par objet par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Contribution par objet"],
    },
  }
)

export default getContributionObjectByIdRoutes
