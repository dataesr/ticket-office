import { Elysia, t } from "elysia"
import { validateQueryParams } from "../../../utils/queryValidator"
import { findPaginated } from "../../../utils/paginatedQuery"
import { responseSchema } from "../../../schemas/get/contactSchema"
import { errorSchema } from "../../../schemas/errors/errorSchema"

const getContactRoutes = new Elysia().get(
  "/contacts",
  async ({ query, set }) => {
    if (!validateQueryParams(query)) {
      set.status = 422
      return { message: "Invalid query parameters" }
    }

    const {
      where = "{}",
      sort,
      page,
      max_results,
      fromApplication,
      status,
    } = query

    let filters: any = {}
    try {
      filters = JSON.parse(where as string)
    } catch (err) {
      set.status = 422
      return { message: "Invalid where parameter: must be valid JSON" }
    }

    if (fromApplication) {
      filters.fromApplication = fromApplication
    }
    if (status) {
      filters.status = status
    }

    const { rows, total } = await findPaginated("contacts", filters, {
      sort,
      page,
      max_results,
    })

    const formattedContacts = rows.map((contact: any) => ({
      id: contact.id || "",
      fromApplication: contact.fromApplication || "",
      treated_at: contact.treated_at || new Date(),
      email: contact.email || "",
      name: contact.name || "",
      message: contact.message,
      comment: contact.comment || "",
      modified_at: contact.modified_at || new Date(),
      created_at: contact.created_at || new Date(),
      status: contact.status || "",
      team: contact.team || [],
      tags: contact.tags || [],
      threads: contact.threads || [],
      extra: contact.extra || {},
      contributionType: "contact",
    }))

    return {
      data: formattedContacts,
      meta: {
        total,
      },
    }
  },
  {
    query: t.Object({
      sort: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      max_results: t.Optional(t.String()),
      where: t.Optional(t.String()),
      fromApplication: t.Optional(t.String()),
      status: t.Optional(t.String()),
    }),
    response: {
      200: responseSchema,
      422: errorSchema,
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir toutes les contributions via formulaire de contact",
      tags: ["Contacts"],
    },
  }
)

export default getContactRoutes
