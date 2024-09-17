<<<<<<< HEAD
import Elysia, { t } from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { responseSchema } from "../../../schemas/get/productionSchema";
=======
import Elysia from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

const getProductionsRoutes = new Elysia();

getProductionsRoutes.get(
  "/production",
  async ({ query, error }: { query: any; error: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }
    const {
      where = "{}",
      sort = "created_at",
      page = 1,
      max_results = 20,
    } = query;
    const filters = JSON.parse(where as string);

    const limit = parseInt(max_results as string, 10) || 20;
    const skip = (parseInt(page as string, 10) - 1) * limit;

    const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith("-") ? -1 : 1;

<<<<<<< HEAD
    const totalContacts = await db
      .collection("contribute_productions")
      .countDocuments(filters)
      .catch((err) => {
        return error(500, "Error fetching contacts count");
      });

=======
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    const productions = await db
      .collection("contribute_productions")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((err) => error(500, "Error fetching productions"));

    const formattedProductions = productions.map((production: any) => ({
<<<<<<< HEAD
      id: production.id.toString(),
      objectId: production.objectId.toString(),
      organisation: production.organisation || "",
      fonction: production.position || "",
=======
      _id: production._id.toString(),
      organisation: production.organisation || "",
      fromApp: production.appName || "",
      collectionName: production.collectionName || "",
      position: production.position || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
      treated_at: production.treated_at || new Date(),
      created_at: production.created_at_at || new Date(),
      modified_at: production.modified_at || new Date(),
      email: production.email || "",
      name: production.name || "",
<<<<<<< HEAD
      comment: production.comment || "",
=======
      message: production.message || "",
      comment: production.comment || "",
      idref: production.idref || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
      status: production.status || "",
      team: production.team || [],
      tags: production.tags || [],
      productions: production.productions || [],
      threads: production.threads || [],
    }));

<<<<<<< HEAD
    return {
      data: formattedProductions,
      meta: {
        total: totalContacts,
      },
    };
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
=======
    return formattedProductions;
  },
  {
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    detail: {
      summary: "Obtenir toutes les Productions",
      description:
        "Cette route retourne une liste de toutes les productions à lier",
      tags: ["Production"],
    },
  }
);

export default getProductionsRoutes;
