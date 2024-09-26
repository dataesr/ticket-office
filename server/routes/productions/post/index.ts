import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postProductionsSchema } from "../../../schemas/post/productionsSchema";
import { productionSchema } from "../../../schemas/get/productionSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { ObjectId } from "mongodb";

type postProductionSchemaType = Static<typeof postProductionsSchema>;

const postProductionRoutes = new Elysia();

postProductionRoutes.post(
  "/production",
  async ({ error, body }: { error: any; body: postProductionSchemaType }) => {
    const extraLowercase = Object.keys(body.extra || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: body.extra ? body.extra[key].toLowerCase() : "",
      }),
      {}
    );

    const newContribution = {
      ...body,
      id: new ObjectId().toHexString(),
      created_at: new Date(),
      status: "new",
      extra: extraLowercase,
    };

    const result = await db
      .collection("contribute_productions")
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
    body: postProductionsSchema,
    response: {
      200: productionSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Créer une nouvelle contribution via formulaire de liaison de productions",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Production"],
    },
  }
);

export default postProductionRoutes;
