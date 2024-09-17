import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { validateQueryParams } from "../../../utils/queryValidator";
import { postRemoveUserSchema } from "../../../schemas/post/removeUserSchema";

type postUpdateUserDataSchemaType = Static<typeof postRemoveUserSchema>;

const postUpdateUserDataRoutes = new Elysia();

postUpdateUserDataRoutes.post(
  "/update-user-data",
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

    const updateUserData = {
      ...body,
    };

    const newContribution: postUpdateUserDataSchemaType = {
      email: updateUserData.email,
      name: updateUserData.name,
      message: updateUserData.message,
      organisation: updateUserData.organisation || "",
      collectionName: updateUserData.collectionName || "",
      fonction: updateUserData.fonction || "",
      created_at: new Date(),
      idref: updateUserData.idref || "",
      status: "new",
    };

    const result = await db
      .collection("update-user-data")
      .insertOne(newContribution);

    if (!result.acknowledged) {
      return error(500, "Failed to create contribution from update-user-data");
    }

    return newContribution;
  },
  {
    body: postRemoveUserSchema,
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
