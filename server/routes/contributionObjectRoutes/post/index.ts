import Elysia, { Static, t } from "elysia";
import { postContactSchema } from "../../../schemas/post/contactSchema";
import db from "../../../libs/mongo";
import { validateQueryParams } from "../../../utils/queryValidator";

type postContributionObjectSchemaType = Static<typeof postContactSchema>;

const postContributionObjectRoutes = new Elysia();

postContributionObjectRoutes.post(
  "/contribute",
  async ({ query, error, body }: { query: any; error: any; body: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

    const contributionData = {
      ...body,
    };
    const newContact: postContributionObjectSchemaType = {
      email: contributionData.email,
      name: contributionData.name,
      message: contributionData.message,
      organisation: contributionData.organisation || "",
      fromApp: contributionData.fromApp || "",
      collectionName: contributionData.collectionName || "",
      fonction: contributionData.fonction || "",
      idref: contributionData.idref || "",
      created_at: new Date(),
      status: "new",
    };

    const result = await db.collection("contribute").insertOne(newContact);

    if (!result.acknowledged) {
      return error(500, "Failed to create contribution");
    }

    return newContact;
  },
  {
    body: postContactSchema,
    response: {
      200: t.Object({ message: t.String() }),
      400: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
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
