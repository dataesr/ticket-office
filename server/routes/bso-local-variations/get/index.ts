import { Elysia, t } from "elysia"

import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { responseSchema } from "../../../schemas/get/variationsSchema"
import { validateQueryParams } from "../../../utils/queryValidator"
import { variationParams } from "../../../schemas/get_id/variationSchema"

const getBsoLocalVariationsRoute = new Elysia().get(
  "/bso-local-variations/:api",
  async ({ query, params: { api }, set }) => {
    if (!validateQueryParams(query)) {
      set.status = 500
      return { message: "Invalid query parameters" }
    }

    const {
      where = "{}",
      sort = "created_at",
      page = 1,
      max_results = "",
    } = query
    const filters = JSON.parse(where as string)

    const limit = max_results || 2000
    const skip = (page - 1) * limit

    const sortField = sort.startsWith("-") ? sort.substring(1) : sort
    const sortOrder = sort.startsWith("-") ? -1 : 1

    const collection = `bso_local_variations_${api}`

    try {
      const totalVariations = await db
        .collection(collection)
        .countDocuments(filters)

      const variations: unknown = await db
        .collection(collection)
        .find(filters)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .toArray()

      return {
        data: variations,
        meta: {
          total: totalVariations,
        },
      } as typeof responseSchema.static
    } catch (error) {
      set.status = 500
      return { message: "Error fetching variations" }
    }
  },
  {
    query: t.Object({
      sort: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      max_results: t.Optional(t.Numeric()),
      where: t.Optional(t.String()),
    }),
    params: variationParams,
    response: {
      200: responseSchema,
      401: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir toutes les déclinaisons locales",
      description:
        "Cette route retourne une liste de toutes les déclinaisons locales.",
      tags: ["Déclinaisons locales"],
    },
  }
)

export default getBsoLocalVariationsRoute
