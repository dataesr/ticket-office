import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { postUpdateUserDataSchema } from "../../../schemas/post/UpdateUserDataSchema";
import { ObjectId } from "mongodb";

type postUpdateUserDataSchemaType = Static<typeof postUpdateUserDataSchema>;

const postUpdateUserDataRoutes = new Elysia();

postUpdateUserDataRoutes.post(
  "/update-user-data",
  async ({
    error,
    body,
  }: {
    error: any;
    body: postUpdateUserDataSchemaType;
  }) => {
    const newContribution = {
      ...body,
      id: new ObjectId().toHexString(),
      created_at: new Date(),
      status: "new",
    };

    const result = await db
      .collection("update-user-data")
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
    body: postUpdateUserDataSchema,
    response: {
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de demande de mise à jour de données utilisateur",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
);

export default postUpdateUserDataRoutes;
