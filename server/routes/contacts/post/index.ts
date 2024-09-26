import Elysia, { Static } from "elysia";
import { postContactSchema } from "../../../schemas/post/contactSchema";
import db from "../../../libs/mongo";
import { contactSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { ObjectId } from "mongodb";

type postContactSchemaType = Static<typeof postContactSchema>;
const postContactsRoutes = new Elysia();

postContactsRoutes.post(
  "/contacts",
  async ({ error, body }: { error: any; body: postContactSchemaType }) => {
    const allowedFromApps = [
      "paysage",
      "scanr",
      "bso",
      "works-magnet",
      "datasupr",
      "curiexplore",
    ];

    if (!allowedFromApps.includes(body.fromApplication)) {
      return error(
        400,
        "Invalid fromApplication value, check child attributes"
      );
    }

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

    const result = await db.collection("contacts").insertOne(newContribution);
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
      summary: "Créer une nouvelle contribution",
      description:
        "Cette route permet de créer une nouvelle contribution soumise via un formulaire de contact.",
      tags: ["Contacts"],
    },
  }
);
export default postContactsRoutes;
