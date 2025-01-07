import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { ObjectId } from "mongodb";
import { contactSchema } from "../../../schemas/get_id/contactSchema";

type contributionObjectType = Static<typeof contactSchema>;

const getContributionObjectByIdRoutes = new Elysia();

getContributionObjectByIdRoutes.get(
  "/contribute/:id",
  async ({ params: { id } }) => {
    const contribution = await db
      .collection("contribute")
      .findOne<contributionObjectType>({
        id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch contribution"));

    if (!contribution) return { message: "Une erreur s'est produite" };

    return contribution;
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
);

export default getContributionObjectByIdRoutes;
