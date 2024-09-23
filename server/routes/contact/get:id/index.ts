import Elysia, { Static, t } from "elysia";
import { contactSchema } from "../../../schemas/get:id/contactSchema";
import db from "../../../libs/mongo";
import { ObjectId } from "mongodb";

type contactType = Static<typeof contactSchema>;

const getContactByIdRoutes = new Elysia();

getContactByIdRoutes.get(
  "/contact/:id",
  async ({ params: { id } }) => {
    const contact = await db
      .collection("contact")
      .findOne<contactType>({
        _id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch contact"));
    if (!contact) return { message: "Une erreur s'est produite" };
    return contact;
  },
  {
    response: {
      400: t.Object({ message: t.String() }),
      401: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary: "Obtenir une contribution via formulaire de contact par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Contact"],
    },
  }
);

export default getContactByIdRoutes;
