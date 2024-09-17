import Elysia from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";

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
      _id: deletation._id.toString(),
      organisation: deletation.organisation || "",
      fonction: deletation.fonction || "",
      collectionName: deletation.collectionName || "",
      fromApp: deletation.fromApp || "",
      treated_at: deletation.treated_at || new Date(),
      email: deletation.email || "",
      name: deletation.name || "",
      message: deletation.message || "",
      comment: deletation.comment || "",
      modified_at: deletation.modified_at || new Date(),
      created_at: deletation.created_at || new Date(),
      idref: deletation.idref || "",
      status: deletation.status || "",
      team: deletation.team || [],
      tags: deletation.tags || [],
      threads: deletation.threads || [],
    }));

    return formattedDeletation;
  },
  {
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