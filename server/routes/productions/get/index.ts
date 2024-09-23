import Elysia, { t } from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
import { productionSchema } from "../../../schemas/get/productionSchema";

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

    const productions = await db
      .collection("contribute_productions")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((err) => error(500, "Error fetching productions"));

    const formattedProductions = productions.map((production: any) => ({
      _id: production._id.toString(),
      organisation: production.organisation || "",
      fromApp: production.appName || "",
      collectionName: production.collectionName || "",
      position: production.position || "",
      treated_at: production.treated_at || new Date(),
      created_at: production.created_at_at || new Date(),
      modified_at: production.modified_at || new Date(),
      email: production.email || "",
      name: production.name || "",
      message: production.message || "",
      comment: production.comment || "",
      idref: production.idref || "",
      status: production.status || "",
      team: production.team || [],
      tags: production.tags || [],
      productions: production.productions || [],
      threads: production.threads || [],
    }));

    return formattedProductions;
  },
  {
    response: {
      200: t.Any(productionSchema),
      401: t.Any({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary: "Obtenir toutes les Productions",
      description:
        "Cette route retourne une liste de toutes les productions à lier",
      tags: ["Production"],
    },
  }
);

export default getProductionsRoutes;
