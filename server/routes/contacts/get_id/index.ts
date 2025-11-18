import { Elysia } from "elysia"
import { contactSchema } from "../../../schemas/get_id/contactSchema"
import db from "../../../libs/mongo"
import { ObjectId } from "mongodb"
import { errorSchema } from "../../../schemas/errors/errorSchema"

type contactType = typeof contactSchema.static

const getContactByIdRoutes = new Elysia()

getContactByIdRoutes.get(
  "/contacts/:id",
  async ({ params: { id } }) => {
    const contact = await db
      .collection("contacts")
      .findOne<contactType>({
        id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch contact"))
    if (!contact) return { message: "Une erreur s'est produite" }
    return contact
  },
  {
    response: {
      200: contactSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir une contribution via formulaire de contact par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Contacts"],
    },
  }
)

export default getContactByIdRoutes
