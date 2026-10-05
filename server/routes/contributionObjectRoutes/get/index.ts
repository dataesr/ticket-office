import { Elysia, t } from "elysia"
import { validateQueryParams } from "../../../utils/queryValidator"
import { findPaginated } from "../../../utils/paginatedQuery"
import { responseSchema } from "../../../schemas/get/contributionsObjectSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const getContributionObjectRoutes = new Elysia().get(
  "/contribute",
  async ({ query, set }) => {
    if (!validateQueryParams(query)) {
      set.status = 422
      return { message: "Invalid query parameters" }
    }

    const { where = "{}", sort, page, max_results } = query
    const filters = JSON.parse(where as string)

    const { rows, total } = await findPaginated("contribute", filters, {
      sort,
      page,
      max_results,
    })

    const formattedContribution = rows.map((contributionObject: any) => ({
      id: contributionObject.id.toString(),
      treated_at: contributionObject.treated_at || new Date(),
      email: contributionObject.email || "",
      name: contributionObject.name || "",
      objectId: contributionObject.objectId || "",
      objectType: contributionObject.objectType || "",
      message: contributionObject.message || "",
      comment: contributionObject.comment || "",
      modified_at: contributionObject.modified_at || new Date(),
      created_at: contributionObject.created_at || new Date(),
      status: contributionObject.status || "",
      team: contributionObject.team || [],
      tags: contributionObject.tags || [],
      threads: contributionObject.threads || [],
      extra: contributionObject.extra || {},
      contributionType: "contribute-object",
    }))

    return {
      data: formattedContribution,
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
      summary:
        "Obtenir toutes les contributions via formulaire de contribution par objets",
      description:
        "Cette route retourne une liste de toutes les contributions soumises via le formulaire de contact.",
      tags: ["Contribution par objet"],
    },
  }
)

export default getContributionObjectRoutes
