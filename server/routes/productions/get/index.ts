import { Elysia, t } from "elysia"
import { validateQueryParams } from "../../../utils/queryValidator"
import db from "../../../libs/mongo"
import { errorSchema } from "../../../schemas/errors/errorSchema"
import { responseSchema } from "../../../schemas/get/productionSchema"

const getProductionsRoutes = new Elysia().get(
  "/production",
  async ({ query, set }: { query: any; set: any }) => {
    if (!validateQueryParams(query)) {
      return (set.status = 422), { message: "Invalid query parameters" }
    }
    const {
      where = "{}",
      sort = "created_at",
      page = 1,
      max_results = "",
    } = query
    const filters = JSON.parse(where as string)

    const limit = parseInt(max_results as string, 10) || 2000
    const skip = (parseInt(page as string, 10) - 1) * limit

    const sortField = sort.startsWith("-") ? sort.substring(1) : sort
    const sortOrder = sort.startsWith("-") ? -1 : 1

    let totalContacts
    try {
      totalContacts = await db
        .collection("contribute_productions")
        .countDocuments(filters)
    } catch (err) {
      set.status = 500
      return { message: "Error fetching contacts count" }
    }

    const productions = await db
      .collection("contribute_productions")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((err) => {
        set.status = 500
        return { message: "Error fetching productions" }
      })

    if (!Array.isArray(productions)) {
      return productions
    }

    const formattedProductions = productions.map((production: any) => ({
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
        total: totalContacts,
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
