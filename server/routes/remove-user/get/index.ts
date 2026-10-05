import { Elysia } from "elysia"
import { validateQueryParams } from "../../../utils/queryValidator"
import { findPaginated } from "../../../utils/paginatedQuery"
import { responseSchema } from "../../../schemas/get/deleteSchema.ts"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const getRemoveUserRoutes = new Elysia().get(
  "/remove-user",
  async ({ query, set }) => {
    if (!validateQueryParams(query)) {
      set.status = 422
      return { message: "Invalid query parameters" }
    }

    const { where = "{}", sort, page, max_results } = query
    const filters = JSON.parse(where as string)

    const { rows, total } = await findPaginated("remove-user", filters, {
      sort,
      page,
      max_results,
    })

    const formattedDeletation = rows.map((deletation: any) => ({
      id: deletation.id.toString(),
      treated_at: deletation.treated_at || new Date(),
      email: deletation.email || "",
      name: deletation.name || "",
      message: deletation.message || "",
      comment: deletation.comment || "",
      modified_at: deletation.modified_at || new Date(),
      created_at: deletation.created_at || new Date(),
      status: deletation.status || "",
      team: deletation.team || [],
      tags: deletation.tags || [],
      threads: deletation.threads || [],
      extra: deletation.extra || {},
      contributionType: "remove-user",
    }))

    return {
      data: formattedDeletation,
      meta: {
        total,
      },
    }
  },
  {
    response: {
      200: responseSchema,
      422: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary:
        "Obtenir toutes les contributions via formulaire de suppression de donnée",
      description:
        "Cette route retourne une liste de toutes les contributions soumises via le formulaire de contact.",
      tags: ["Suppression de profil"],
    },
  }
)

export default getRemoveUserRoutes
