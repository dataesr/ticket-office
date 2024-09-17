import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { ObjectId } from "mongodb";
import { contactSchema } from "../../../schemas/get:id/contactSchema";

type contributionObjectType = Static<typeof contactSchema>;

const getContributionObjectByIdRoutes = new Elysia();

getContributionObjectByIdRoutes.get(
  "/contribute/:id",
  async ({ params: { id } }) => {
    const contact = await db
      .collection("contribute")
      .findOne<contributionObjectType>({
        _id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch contribution"));

    if (!contact) return { message: "Une erreur s'est produite" };

    return contact;
  },
  {
    body: contactSchema,
    detail: {
      summary:
        "Obtenir une contribution via formulaire de contribution par objet par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Contribution par objet"],
    },
  }
);

export default getContributionObjectByIdRoutes;
