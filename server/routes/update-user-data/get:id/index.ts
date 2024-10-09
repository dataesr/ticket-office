import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { ObjectId } from "mongodb";
import { updateDatasSchema } from "../../../schemas/get/updateDatasSchema";

type updateUserDataType = Static<typeof updateDatasSchema>;

const getUpdateUserDataByIdRoutes = new Elysia();

getUpdateUserDataByIdRoutes.get(
  "/update-user-data/:id",
  async ({ params: { id } }) => {
    const contribution = await db
      .collection("update-user-data")
      .findOne<updateUserDataType>({
        id: new ObjectId(id),
      })
      .catch((error) =>
        error(500, "Failed to fetch contribution from update-user-data")
      );

    if (!contribution) return { message: "Une erreur s'est produite" };

    return contribution;
  },
  {
    detail: {
      summary:
        "Obtenir une contribution via formulaire de mise à jour de donnée utilisateur par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
);

export default getUpdateUserDataByIdRoutes;
