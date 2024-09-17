import Elysia from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";

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
        _id: contributionObject._id.toString(),
        organisation: contributionObject.organisation || "",
        fonction: contributionObject.fonction || "",
        collectionName: contributionObject.collectionName || "",
        fromApp: contributionObject.fromApp || "",
        treated_at: contributionObject.treated_at || new Date(),
        email: contributionObject.email || "",
        name: contributionObject.name || "",
        message: contributionObject.message || "",
        comment: contributionObject.comment || "",
        modified_at: contributionObject.modified_at || new Date(),
        created_at: contributionObject.created_at || new Date(),
        idref: contributionObject.idref || "",
        status: contributionObject.status || "",
        team: contributionObject.team || [],
        tags: contributionObject.tags || [],
        threads: contributionObject.threads || [],
      })
    );

    return formattedContribution;
  },
  {
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
