import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { ObjectId } from "mongodb";
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts";

type removeUserType = Static<typeof deleteSchema>;

const getRemoveUserByIdRoutes = new Elysia();

getRemoveUserByIdRoutes.get(
  "/remove-user/:id",
  async ({ params: { id } }) => {
    const contribution = await db
      .collection("remove-user")
      .findOne<removeUserType>({
<<<<<<< HEAD
        id: new ObjectId(id),
=======
        _id: new ObjectId(id),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
      })
      .catch((error) => error(500, "Failed to fetch remove-user"));

    if (!contribution) return { message: "Une erreur s'est produite" };

    return contribution;
  },
  {
<<<<<<< HEAD
=======
    body: deleteSchema,
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    response: {
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary:
        "Obtenir une contribution via formulaire de supression de profil par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Supression de profil"],
    },
  }
);

export default getRemoveUserByIdRoutes;
