<<<<<<< HEAD
<<<<<<< HEAD
import Elysia, { t } from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
<<<<<<< HEAD
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { responseSchema } from "../../../schemas/get/productionSchema";
=======
import Elysia from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import Elysia, { t } from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
<<<<<<< HEAD
import { productionSchema } from "../../../schemas/get/productionSchema";
>>>>>>> dc7be2b (fix(schema): clean schemas)
=======
import { productionListSchema } from "../../../schemas/get/productionSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
>>>>>>> 2e9190f (fix(api): update schemas)
=======
import { errorSchema } from "../../../schemas/errors/errorSchema";
import { responseSchema } from "../../../schemas/get/productionSchema";
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)

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
<<<<<<< HEAD
=======
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)
    const totalContacts = await db
      .collection("contribute_productions")
      .countDocuments(filters)
      .catch((err) => {
        return error(500, "Error fetching contacts count");
      });

<<<<<<< HEAD
=======
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)
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
<<<<<<< HEAD
      id: production.id.toString(),
<<<<<<< HEAD
<<<<<<< HEAD
      objectId: production.objectId.toString(),
=======
      objectId: production._id.toString(),
>>>>>>> 03c66cc (fix(contribute_productions): update schemas)
=======
      objectId: production.objectId.toString(),
>>>>>>> e67702e (fix(contribute_productions): fix ids)
      organisation: production.organisation || "",
      fonction: production.position || "",
=======
      _id: production._id.toString(),
=======
      id: production.id.toString(),
>>>>>>> 2e9190f (fix(api): update schemas)
      organisation: production.organisation || "",
<<<<<<< HEAD
      collectionName: production.collectionName || "",
<<<<<<< HEAD
      position: production.position || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
=======
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
      fonction: production.position || "",
>>>>>>> 2e9190f (fix(api): update schemas)
      treated_at: production.treated_at || new Date(),
      created_at: production.created_at_at || new Date(),
      modified_at: production.modified_at || new Date(),
      email: production.email || "",
      name: production.name || "",
<<<<<<< HEAD
<<<<<<< HEAD
      comment: production.comment || "",
=======
      message: production.message || "",
=======
>>>>>>> dc5a63d (fix(productions): delete message from schemas)
      comment: production.comment || "",
<<<<<<< HEAD
      idref: production.idref || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
      status: production.status || "",
      team: production.team || [],
      tags: production.tags || [],
      productions: production.productions || [],
      threads: production.threads || [],
    }));

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)
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
<<<<<<< HEAD
    }),
    response: {
      200: responseSchema,
<<<<<<< HEAD
      401: errorSchema,
      500: errorSchema,
    },
=======
    return formattedProductions;
  },
  {
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
=======
    query: t.Object({
      sort: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      max_results: t.Optional(t.Numeric()),
      where: t.Optional(t.String()),
      fromApp: t.Optional(t.String()),
=======
>>>>>>> cebb1b3 (fix(api schema): update schema, delete fromApp from inconcerned object)
    }),
>>>>>>> 2e9190f (fix(api): update schemas)
    response: {
      200: productionListSchema,
=======
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)
      401: errorSchema,
      500: errorSchema,
    },
>>>>>>> dc7be2b (fix(schema): clean schemas)
    detail: {
      summary: "Obtenir toutes les Productions",
      description:
        "Cette route retourne une liste de toutes les productions à lier",
      tags: ["Production"],
    },
  }
);

export default getProductionsRoutes;
