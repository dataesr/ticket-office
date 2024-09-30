import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postRemoveUserSchema } from "../../../schemas/post/removeUserSchema";
import { ObjectId } from "mongodb";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts";

type postRemoveUserSchemaType = Static<typeof postRemoveUserSchema>;

const postRemoveUserRoutes = new Elysia();

postRemoveUserRoutes.post(
  "/remove-user",
  async ({ error, body }: { error: any; body: postRemoveUserSchemaType }) => {
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {}
    );

    const _id = new ObjectId();
    const newContribution = {
      ...body,
      _id,
      extra: extraLowercase,
      id: _id.toHexString(),
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
      200: deleteSchema,
      401: errorSchema,
      500: errorSchema,
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
