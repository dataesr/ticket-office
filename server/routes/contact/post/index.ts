import Elysia, { Static } from "elysia";
import { postContactSchema } from "../../../schemas/post/contactSchema";
import db from "../../../libs/mongo";
import { contactSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { ObjectId } from "mongodb";

type postContactSchemaType = Static<typeof postContactSchema>;
const postContactRoutes = new Elysia();

postContactRoutes.post(
  "/contact",
  async ({ error, body }: { error: any; body: postContactSchemaType }) => {
    const newContribution = {
      ...body,
      id: new ObjectId().toHexString(),
      created_at: new Date(),
      status: "new",
    };

    const result = await db.collection("contact").insertOne(newContribution);
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
    body: postContactSchema,
    response: {
      200: contactSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Créer une nouvelle contribution via formulaire de contact",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via le formulaire de contact.",
      tags: ["Contact"],
      example: {
        request: {
          body: {
            email: "debache.mihoub@example.com",
            name: "Debache Mihoub",
            message: "Ceci est un message de test.",
            organisation: "MESRI",
            fromApp: "paysage",
            collectionName: "contact",
            fonction: "Développeur",
            idref: "12312321",
            status: "new",
          },
        },
      },
    },
  }
);

export default postContactRoutes;
