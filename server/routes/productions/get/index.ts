import { Elysia, t } from "elysia"
import { validateQueryParams } from "../../../utils/queryValidator"
import { findPaginated } from "../../../utils/paginatedQuery"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { responseSchema } from "../../../schemas/get/productionSchema"

const getProductionsRoutes = new Elysia().get(
  "/production",
  async ({ query, set }) => {
    if (!validateQueryParams(query)) {
      set.status = 422
      return { message: "Invalid query parameters" }
    }

    const { where = "{}", sort, page, max_results } = query
    const filters = JSON.parse(where as string)

    const { rows, total } = await findPaginated(
      "contribute_productions",
      filters,
      { sort, page, max_results }
    )

    const formattedProductions = rows.map((production: any) => ({
      id: production.id.toString(),
      objectId: production.objectId.toString(),
      organisation: production.organisation || "",
      fonction: production.position || "",
      treated_at: production.treated_at || new Date(),
      created_at: production.created_at || new Date(),
      modified_at: production.modified_at || new Date(),
      email: production.email || "",
      name: production.name || "",
      comment: production.comment || "",
      status: production.status || "",
      team: production.team || [],
      tags: production.tags || [],
      productions: production.productions || [],
      threads: production.threads || [],
      contributionType: "production",
    }))

    return {
      data: formattedProductions,
      meta: {
        total,
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
      summary: "Obtenir toutes les Productions",
      description:
        "Cette route retourne une liste de toutes les productions à lier",
      tags: ["Production"],
    },
  }
)

export default getProductionsRoutes
