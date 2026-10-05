import { Elysia, t } from "elysia"

import { errorSchema } from "../../../schemas/errors/errorSchema"
import { responseSchema } from "../../../schemas/get/variationsSchema"
import { validateQueryParams } from "../../../utils/queryValidator"
import { findPaginated } from "../../../utils/paginatedQuery"
import { variationParams } from "../../../schemas/get_id/variationSchema"

const getBsoLocalVariationsRoute = new Elysia().get(
  "/bso-local-variations/:api",
  async ({ query, params: { api }, set }) => {
    if (!validateQueryParams(query)) {
      set.status = 422
      return { message: "Invalid query parameters" }
    }

    const { where = "{}", sort, page, max_results } = query
    const filters = JSON.parse(where as string)

    const { rows, total } = await findPaginated(
      `bso_local_variations_${api}`,
      filters,
      { sort, page, max_results }
    )

    return {
      data: rows,
      meta: {
        total,
      },
    } as typeof responseSchema.static
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
