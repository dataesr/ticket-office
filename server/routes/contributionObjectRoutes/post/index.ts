import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postContributionObjectSchema } from "../../../schemas/post/contributionByObject";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { contributionObjectSchema } from "../../../schemas/get/contributionsObjectSchema";
import { ObjectId } from "mongodb";

type postContributionObjectSchemaType = Static<
  typeof postContributionObjectSchema
>;

const postContributionObjectRoutes = new Elysia();

postContributionObjectRoutes.post(
  "/contribute",
  async ({
    error,
    body,
  }: {
    error: any;
    body: postContributionObjectSchemaType;
  }) => {
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {}
    );

    const newContribution = {
      ...body,
      extra: extraLowercase,
      id: new ObjectId().toHexString(),
      created_at: new Date(),
      status: "new",
    };

    const result = await db.collection("contribute").insertOne(newContribution);

    if (!body.objectId && !body.objectType) {
      return error(400, "objectId is required when objectType is provided");
    }

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
    body: postContributionObjectSchema,
    response: {
      200: contributionObjectSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de contribution par objet",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Contribution par objet"],
    },
  }
);

export default postContributionObjectRoutes;
