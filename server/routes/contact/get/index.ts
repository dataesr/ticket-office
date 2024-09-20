import Elysia, { t } from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
import { contactSchema } from "../../../schemas/get/contactSchema";

const getContactRoutes = new Elysia();

getContactRoutes.get(
  "/contact",
  async ({ query, error }: { query: any; error: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }

    const {
      where = "{}",
      sort = "created_at",
      page = 1,
      max_results = 20,
      fromApp,
    } = query;
    const filters = JSON.parse(where as string);
    if (fromApp) {
      filters.fromApp = fromApp;
    }
    const limit = parseInt(max_results as string, 10) || 20;
    const skip = (parseInt(page as string, 10) - 1) * limit;
    const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const contacts = await db
      .collection("contact")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch((err) => error(500, "Error fetching contacts"));

    const formattedContacts = contacts.map((contact: any) => ({
      _id: contact._id.toString(),
      organisation: contact.organisation || "",
      fonction: contact.fonction || "",
      collectionName: contact.collectionName || "",
      fromApp: contact.fromApp || "",
      treated_at: contact.treated_at || new Date(),
      email: contact.email || "",
      name: contact.name || "",
      message: contact.message,
      comment: contact.comment || "",
      modified_at: contact.modified_at || new Date(),
      created_at: contact.created_at || new Date(),
      idref: contact.idref || "",
      status: contact.status || "",
      team: contact.team || [],
      tags: contact.tags || [],
      threads: contact.threads || [],
    }));

    return formattedContacts;
  },
  {
    body: contactSchema,
    response: {
      400: t.Object({ message: t.String() }),
      401: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary: "Obtenir toutes les contributions via formulaire de contact",
      tags: ["Contact"],
    },
  }
);

export default getContactRoutes;
