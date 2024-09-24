import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { postProductionsSchema } from "../../../schemas/post/productionsSchema";
import { productionSchema } from "../../../schemas/get/productionSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";

type postProductionSchemaType = Static<typeof postProductionsSchema>;

const postProductionRoutes = new Elysia();

postProductionRoutes.post(
  "/production",
  async ({ error, body }: { error: any; body: any }) => {
    const productionData = {
      ...body,
    };
    const newContact: postProductionSchemaType = {
      email: productionData.email,
      name: productionData.name,
      message: productionData.message,
      organisation: productionData.organisation || "",
      collectionName: productionData.collectionName || "",
      fonction: productionData.fonction || "",
      created_at: new Date(),
      idref: productionData.idref || "",
      status: "new",
      productions: productionData.productions || [],
    };

    const result = await db
      .collection("contribute_productions")
      .insertOne(newContact);

    if (!result.acknowledged) {
      return error(500, "Failed to create contribution");
    }

    return newContact;
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
