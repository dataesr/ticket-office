import Elysia, { t, Static } from "elysia"

import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { responseSchema } from "../../../schemas/get/variationsSchema"
import { validateQueryParams } from "../../../utils/queryValidator"
import { variationParams } from "../../../schemas/get_id/variationSchema"

const getBsoLocalVariationsRoute = new Elysia()

getBsoLocalVariationsRoute.get(
  "/bso-local-variations/:api",
  async ({ query, params: { api }, error }) => {
    if (!validateQueryParams(query)) {
      return error(500, { message: "Invalid query parameters" })
    }

    const { where = "{}", sort = "created_at", page = 1, max_results = "" } = query
    const filters = JSON.parse(where as string)

    const limit = max_results || 2000
    const skip = (page - 1) * limit

    const sortField = sort.startsWith("-") ? sort.substring(1) : sort
    const sortOrder = sort.startsWith("-") ? -1 : 1

    const collection = `bso_local_variations_${api}`

    const totalVariations = await db
      .collection(collection)
      .countDocuments(filters)
      .catch((_) => error(500, { message: "Error fetching variations count" }))

    const variations: unknown = await db
      .collection(collection)
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((_) => error(500, { message: "Error fetching variations" }))

    return {
      data: variations,
      meta: {
        total: totalVariations,
      },
    } as Static<typeof responseSchema>
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
      description: "Cette route retourne une liste de toutes les déclinaisons locales.",
      tags: ["Déclinaisons locales"],
    },
  }
)

export default getBsoLocalVariationsRoute
