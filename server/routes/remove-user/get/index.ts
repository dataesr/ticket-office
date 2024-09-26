import Elysia from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { responseSchema } from "../../../schemas/get/deleteSchema.ts";
import { errorSchema } from "../../../schemas/errors/errorSchema";
=======
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import { deleteSchema } from "../../../schemas/get/deleteSchema.ts";
>>>>>>> dc7be2b (fix(schema): clean schemas)
=======
import { responseSchema } from "../../../schemas/get/deleteSchema.ts";
import { errorSchema } from "../../../schemas/errors/errorSchema";
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)

const getRemoveUserRoutes = new Elysia();

getRemoveUserRoutes.get(
  "/remove-user",
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
      .collection("remove-user")
      .countDocuments(filters)
      .catch((err) => {
        return error(500, "Error fetching contacts count");
      });

<<<<<<< HEAD
=======
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)
    const deletation = await db
      .collection("remove-user")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((err) =>
        error(500, "Error fetching contribution from remove-user")
      );

    const formattedDeletation = deletation.map((deletation: any) => ({
<<<<<<< HEAD
<<<<<<< HEAD
      id: deletation.id.toString(),
<<<<<<< HEAD
=======
      _id: deletation._id.toString(),
=======
      id: deletation.id.toString(),
>>>>>>> 2e9190f (fix(api): update schemas)
      organisation: deletation.organisation || "",
      fonction: deletation.fonction || "",
<<<<<<< HEAD
      collectionName: deletation.collectionName || "",
<<<<<<< HEAD
      fromApp: deletation.fromApp || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> cebb1b3 (fix(api schema): update schema, delete fromApp from inconcerned object)
=======
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
      treated_at: deletation.treated_at || new Date(),
      email: deletation.email || "",
      name: deletation.name || "",
      message: deletation.message || "",
      comment: deletation.comment || "",
      modified_at: deletation.modified_at || new Date(),
      created_at: deletation.created_at || new Date(),
<<<<<<< HEAD
<<<<<<< HEAD
=======
      idref: deletation.idref || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
      status: deletation.status || "",
      team: deletation.team || [],
      tags: deletation.tags || [],
      threads: deletation.threads || [],
<<<<<<< HEAD
<<<<<<< HEAD
      extra: deletation.extra || {},
    }));

    return {
      data: formattedDeletation,
      meta: {
        total: totalContacts,
      },
    };
<<<<<<< HEAD
  },
  {
    response: {
      200: responseSchema,
      422: errorSchema,
      500: errorSchema,
    },
=======
=======
      extra: deletation.extra || {},
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    }));

    return formattedDeletation;
=======
>>>>>>> 2bdd841 (fix(api): update schema get data for productions, remove, update route)
  },
  {
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
    response: {
      200: responseSchema,
      422: errorSchema,
      500: errorSchema,
    },
>>>>>>> dc7be2b (fix(schema): clean schemas)
    detail: {
      summary:
        "Obtenir toutes les contributions via formulaire de supression de donnée",
      description:
        "Cette route retourne une liste de toutes les contributions soumises via le formulaire de contact.",
      tags: ["Supression de profil"],
    },
  }
);

export default getRemoveUserRoutes;
