import Elysia, { Static, t } from "elysia";
import db from "../../../libs/mongo";
import { validateQueryParams } from "../../../utils/queryValidator";
import { postProductionsSchema } from "../../../schemas/post/productionsSchema";

type postProductionSchemaType = Static<typeof postProductionsSchema>;

const postProductionRoutes = new Elysia();

postProductionRoutes.post(
  "/production",
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

    const productionData = {
      ...body,
    };
    const newContact: postProductionSchemaType = {
      email: productionData.email,
      name: productionData.name,
      message: productionData.message,
      organisation: productionData.organisation || "",
      fromApp: productionData.fromApp || "",
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
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
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
