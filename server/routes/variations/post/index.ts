import Elysia, { Static } from "elysia"
import db from "../../../libs/mongo"
import { postVariationSchema } from "../../../schemas/post/variationSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { variationSchema } from "../../../schemas/get_id/variationSchema"
import { ObjectId } from "mongodb"

type postVariationSchemaType = Static<typeof postVariationSchema>

const postVariationRoutes = new Elysia()

postVariationRoutes.post(
  "/variations",
  async ({ error, body }: { error: any; body: postVariationSchemaType }) => {
    const _id = new ObjectId()
    const newVariation = {
      ...body,
      _id,
      id: _id.toHexString(),
      created_at: new Date(),
      status: "new",
      states: {
        file: "none",
        code: "none",
        index: "none",
      },
    }

    const result = await db.collection("local_variations").insertOne(newVariation)

    if (!result.insertedId) {
      return error(500, "Failed to create the variation")
    }

    const finalVariation = {
      ...newVariation,
      id: result.insertedId.toHexString(),
    }

    return finalVariation
  },
  {
    body: postVariationSchema,
    response: {
      200: variationSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Créer une nouvelle déclinaison locale",
      description: "Cette route permet de créer une nouvelle déclinaison locale.",
      tags: ["Déclinaisons locales"],
    },
  }
)

export default postVariationRoutes
