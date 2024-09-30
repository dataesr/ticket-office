import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postUpdateUserDataSchema } from "../../../schemas/post/UpdateUserDataSchema";
import { ObjectId } from "mongodb";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { updateDatasSchema } from "../../../schemas/get/updateDatasSchema";

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
      200: updateDatasSchema,
      401: errorSchema,
      500: errorSchema,
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
