import Elysia, { Static } from "elysia"
import db from "../../../libs/mongo"
import { postVariationSchema } from "../../../schemas/post/variationSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { variationSchema } from "../../../schemas/get_id/variationSchema"
import { ObjectId } from "mongodb"

type postVariationSchemaType = Static<typeof postVariationSchema>

const postVariationRoute = new Elysia()

postVariationRoute.post(
  "/variations",
  async ({ error, body }: { error: any; body: postVariationSchemaType }) => {
    const _id = new ObjectId()
    const newVariation = {
      ...body,
      _id,
      id: _id.toHexString(),
      created_at: new Date(),
      status: "new",
      tags: {
        file: "none",
        index: "none",
        notification: "none",
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

export default postVariationRoute
