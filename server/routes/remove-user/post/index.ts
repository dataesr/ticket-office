import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { validateQueryParams } from "../../../utils/queryValidator";
import { postRemoveUserSchema } from "../../../schemas/post/removeUserSchema";

type postRemoveUserSchemaType = Static<typeof postRemoveUserSchema>;

const postRemoveUserRoutes = new Elysia();

postRemoveUserRoutes.post(
  "/remove-user",
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

    const removeUserData = {
      ...body,
    };
    const newDeletation: postRemoveUserSchemaType = {
      email: removeUserData.email,
      name: removeUserData.name,
      message: removeUserData.message,
      organisation: removeUserData.organisation || "",
      collectionName: removeUserData.collectionName || "",
      fonction: removeUserData.fonction || "",
      created_at: new Date(),
      idref: removeUserData.idref || "",
      status: removeUserData.status || "new",
    };

    const result = await db.collection("remove-user").insertOne(newDeletation);

    if (!result.acknowledged) {
      return error(500, "Failed to create contribution");
    }

    return newDeletation;
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
