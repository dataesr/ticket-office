import Elysia, { t } from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
<<<<<<< HEAD
<<<<<<< HEAD
import { responseSchema } from "../../../schemas/get/updateDatasSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
=======
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import { updateDatasSchema } from "../../../schemas/get/updateDatasSchema";
>>>>>>> dc7be2b (fix(schema): clean schemas)

const getUpdateUserDataRoutes = new Elysia();

getUpdateUserDataRoutes.get(
  "/update-user-data",
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
      .collection("update-user-data")
      .countDocuments(filters)
      .catch((err) => {
        return error(500, "Error fetching contacts count");
      });

=======
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    const contribution = await db
      .collection("update-user-data")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((err) =>
        error(500, "Error fetching contribution from update-user-data")
      );

    const formattedContribution = contribution.map((contrib: any) => ({
<<<<<<< HEAD
<<<<<<< HEAD
      id: contrib.id.toString(),
=======
      _id: contrib._id.toString(),
=======
      id: contrib.id.toString(),
>>>>>>> 2e9190f (fix(api): update schemas)
      organisation: contrib.organisation || "",
      fonction: contrib.fonction || "",
      collectionName: contrib.collectionName || "",
      fromApp: contrib.fromApp || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
      treated_at: contrib.treated_at || new Date(),
      email: contrib.email || "",
      name: contrib.name || "",
      message: contrib.message || "",
      comment: contrib.comment || "",
      modified_at: contrib.modified_at || new Date(),
      created_at: contrib.created_at || new Date(),
<<<<<<< HEAD
=======
      idref: contrib.idref || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
      status: contrib.status || "",
      team: contrib.team || [],
      tags: contrib.tags || [],
      threads: contrib.threads || [],
<<<<<<< HEAD
      extra: contrib.extra || {},
    }));

    return {
      data: formattedContribution,
      meta: {
        total: totalContacts,
      },
    };
  },
  {
    response: {
      200: responseSchema,
      422: errorSchema,
      500: errorSchema,
    },
=======
    }));

    return formattedContribution;
  },
  {
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
    response: {
      200: t.Any(updateDatasSchema),
      401: t.Any({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
>>>>>>> dc7be2b (fix(schema): clean schemas)
    detail: {
      summary:
        "Obtenir toutes les contributions via formulaire de mise à jour de donnée utilisateur",
      description:
        "Cette route retourne une liste de toutes les contributions soumises via le formulaire de contact.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
);

export default getUpdateUserDataRoutes;
