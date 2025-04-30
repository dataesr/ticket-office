import Elysia, { t } from "elysia"

import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { responseSchema } from "../../../schemas/get/variationsSchema"
import { validateQueryParams } from "../../../utils/queryValidator"

const getBsoLocalVariationsDatasetsRoute = new Elysia()

getBsoLocalVariationsDatasetsRoute.get(
  "/bso-local-variations-datasets",
  async ({ query, error }: { query: any; error: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters")
    }

    const { where = "{}", sort = "created_at", page = 1, max_results = "" } = query
    const filters = JSON.parse(where as string)

    const limit = parseInt(max_results as string, 10) || 2000
    const skip = (parseInt(page as string, 10) - 1) * limit

    const sortField = sort.startsWith("-") ? sort.substring(1) : sort
    const sortOrder = sort.startsWith("-") ? -1 : 1

    const totalVariations = await db
      .collection("bso_local_variations_datasets")
      .countDocuments(filters)
      .catch((_) => error(500, "Error fetching variations count"))

    const variations = await db
      .collection("bso_local_variations_datasets")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((_) => error(500, "Error fetching variations"))

    return {
      data: variations,
      meta: {
        total: totalVariations,
      },
    }
  },
  {
    query: t.Object({
      sort: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      max_results: t.Optional(t.Numeric()),
      where: t.Optional(t.String()),
    }),
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

export default getBsoLocalVariationsDatasetsRoute;
