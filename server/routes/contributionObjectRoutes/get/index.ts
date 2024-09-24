<<<<<<< HEAD
<<<<<<< HEAD
import Elysia, { t } from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
import { responseSchema } from "../../../schemas/get/contributionsObjectSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
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
import { contributionObjectSchema } from "../../../schemas/get/contributionsObjectSchema";
>>>>>>> dc7be2b (fix(schema): clean schemas)
=======
import { contributionObjectListSchema } from "../../../schemas/get/contributionsObjectSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";
>>>>>>> 2e9190f (fix(api): update schemas)

const getContributionObjectRoutes = new Elysia();

getContributionObjectRoutes.get(
  "/contribute",
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
    const totalContacts = await db
      .collection("contribute")
      .countDocuments(filters)
      .catch((err) => {
        return error(500, "Error fetching contacts count");
      });

=======
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 2e9190f (fix(api): update schemas)
    const contributionObject = await db
      .collection("contribute")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((err) => error(500, "Error fetching contributions"));

    const formattedContribution = contributionObject.map(
      (contributionObject: any) => ({
<<<<<<< HEAD
<<<<<<< HEAD
        id: contributionObject.id.toString(),
        treated_at: contributionObject.treated_at || new Date(),
        email: contributionObject.email || "",
        name: contributionObject.name || "",
        objectId: contributionObject.objectId || "",
        objectType: contributionObject.objectType || "",
=======
        _id: contributionObject._id.toString(),
=======
        id: contributionObject.id.toString(),
>>>>>>> 2e9190f (fix(api): update schemas)
        organisation: contributionObject.organisation || "",
        fonction: contributionObject.fonction || "",
        collectionName: contributionObject.collectionName || "",
        fromApp: contributionObject.fromApp || "",
        treated_at: contributionObject.treated_at || new Date(),
        email: contributionObject.email || "",
        name: contributionObject.name || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
        message: contributionObject.message || "",
        comment: contributionObject.comment || "",
        modified_at: contributionObject.modified_at || new Date(),
        created_at: contributionObject.created_at || new Date(),
<<<<<<< HEAD
=======
        idref: contributionObject.idref || "",
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
        status: contributionObject.status || "",
        team: contributionObject.team || [],
        tags: contributionObject.tags || [],
        threads: contributionObject.threads || [],
<<<<<<< HEAD
        extra: contributionObject.extra || {},
      })
    );

    return {
      data: formattedContribution,
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
      })
    );

    return formattedContribution;
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
    }),
>>>>>>> 2e9190f (fix(api): update schemas)
    response: {
      200: contributionObjectListSchema,
      401: errorSchema,
      500: errorSchema,
    },
>>>>>>> dc7be2b (fix(schema): clean schemas)
    detail: {
      summary:
        "Obtenir toutes les contributions via formulaire de contribution par objets",
      description:
        "Cette route retourne une liste de toutes les contributions soumises via le formulaire de contact.",
      tags: ["Contribution par objet"],
    },
  }
);

export default getContributionObjectRoutes;
