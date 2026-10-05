import { Elysia } from "elysia"
import { validateQueryParams } from "../../../utils/queryValidator"
import { findPaginated } from "../../../utils/paginatedQuery"
import { responseSchema } from "../../../schemas/get/updateDatasSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const getUpdateUserDataRoutes = new Elysia().get(
  "/update-user-data",
  async ({ query, set }) => {
    if (!validateQueryParams(query)) {
      set.status = 422
      return { message: "Invalid query parameters" }
    }

    const { where = "{}", sort, page, max_results } = query
    const filters = JSON.parse(where as string)

    const { rows, total } = await findPaginated("update-user-data", filters, {
      sort,
      page,
      max_results,
    })

    const formattedContribution = rows.map((contrib: any) => ({
      id: contrib.id.toString(),
      treated_at: contrib.treated_at || new Date(),
      email: contrib.email || "",
      name: contrib.name || "",
      message: contrib.message || "",
      comment: contrib.comment || "",
      modified_at: contrib.modified_at || new Date(),
      created_at: contrib.created_at || new Date(),
      status: contrib.status || "",
      team: contrib.team || [],
      tags: contrib.tags || [],
      threads: contrib.threads || [],
      extra: contrib.extra || {},
      contributionType: "update-user-data",
    }))

    return {
      data: formattedContribution,
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
        "Obtenir toutes les contributions via formulaire de mise à jour de donnée utilisateur",
      description:
        "Cette route retourne une liste de toutes les contributions soumises via le formulaire de contact.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
)

export default getUpdateUserDataRoutes
