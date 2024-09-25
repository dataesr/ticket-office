import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { postRemoveUserSchema } from "../../../schemas/post/removeUserSchema";
import { ObjectId } from "mongodb";

type postRemoveUserSchemaType = Static<typeof postRemoveUserSchema>;

const postRemoveUserRoutes = new Elysia();

postRemoveUserRoutes.post(
  "/remove-user",
  async ({ error, body }: { error: any; body: postRemoveUserSchemaType }) => {
    const newContribution = {
      ...body,
      id: new ObjectId().toHexString(),
      created_at: new Date(),
      status: "new",
    };

    const result = await db
      .collection("remove-user")
      .insertOne(newContribution);

    if (!result.insertedId) {
      return error(500, "Failed to create the contribution");
    }

    const finalContribution = {
      ...newContribution,
      id: result.insertedId.toHexString(),
    };

    return finalContribution;
  },
  {
    body: postRemoveUserSchema,
    response: {
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary: "Créer une nouvelle demande de suppression de profil",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Supression de profil"],
    },
  }
);

export default postRemoveUserRoutes;
