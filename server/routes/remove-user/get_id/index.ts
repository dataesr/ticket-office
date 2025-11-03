import { Elysia, t } from "elysia"
import db from "../../../libs/mongo"
import { ObjectId } from "mongodb"
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts"

type removeUserType = typeof deleteSchema.static

const getRemoveUserByIdRoutes = new Elysia()

getRemoveUserByIdRoutes.get(
  "/remove-user/:id",
  async ({ params: { id } }) => {
    const contribution = await db
      .collection("remove-user")
      .findOne<removeUserType>({
        id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch remove-user"))

    if (!contribution) return { message: "Une erreur s'est produite" }

    return contribution
  },
  {
    response: {
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary:
        "Obtenir une contribution via formulaire de suppression de profil par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Suppression de profil"],
    },
  }
)

export default getRemoveUserByIdRoutes
