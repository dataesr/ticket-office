import Elysia, { t } from "elysia";
import { validateQueryParams } from "../../../utils/queryValidator";
import db from "../../../libs/mongo";
<<<<<<< HEAD
import { responseSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";

const getContactRoutes = new Elysia();
=======
import { contactListSchema } from "../../../schemas/get/contactSchema";
import { errorSchema } from "../../../schemas/errors/errorSchema";

const getContactRoutes = new Elysia();

>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
getContactRoutes.get(
  "/contacts",
  async ({ query, error }: { query: any; error: any }) => {
    if (!validateQueryParams(query)) {
      return error(422, "Invalid query parameters");
    }
<<<<<<< HEAD

=======
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    const {
      where = "{}",
      sort = "created_at",
      page = 1,
      max_results = 20,
<<<<<<< HEAD
      fromApplication,
    } = query;

    let filters = JSON.parse(where as string);
    if (fromApplication) {
      filters.fromApplication = fromApplication;
=======
      fromApp,
    } = query;

    let filters = JSON.parse(where as string);
    if (fromApp) {
      filters.fromApp = fromApp;
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    }

    const limit = parseInt(max_results as string, 10) || 20;
    const skip = (parseInt(page as string, 10) - 1) * limit;
    const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith("-") ? -1 : 1;

<<<<<<< HEAD
    const totalContacts = await db
      .collection("contacts")
      .countDocuments(filters)
      .catch((err) => {
        return error(500, "Error fetching contacts count");
      });

=======
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    const contacts = await db
      .collection("contacts")
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()
<<<<<<< HEAD
      .catch((err) => {
        return error(500, "Error fetching contacts");
      });

    const formattedContacts = contacts.map((contact: any) => ({
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
    }));

    return {
      data: formattedContacts,
      meta: {
        total: totalContacts,
      },
    };
  },
=======
      .catch((err) => error(500, "Error fetching contacts"));

    const formattedContacts = contacts.map((contact: any) => {
      return {
        id: contact.id || "",
        organisation: contact.organisation || "",
        fonction: contact.fonction || "",
        fromApp: contact.fromApp || "",
        fromSubApp: contact.fromSubApp || "",
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
      };
    });

    return formattedContacts;
  },

>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
  {
    query: t.Object({
      sort: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      max_results: t.Optional(t.Numeric()),
      where: t.Optional(t.String()),
<<<<<<< HEAD
      fromApplication: t.Optional(t.String()),
    }),
    response: {
      200: responseSchema,
      422: errorSchema,
=======
      fromApp: t.Optional(t.String()),
    }),
    response: {
      200: contactListSchema,
      401: errorSchema,
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
      500: errorSchema,
    },
    detail: {
      summary: "Obtenir toutes les contributions via formulaire de contact",
<<<<<<< HEAD
      tags: ["Contacts"],
=======
      tags: ["Contact"],
>>>>>>> 1d567d7 (fix(api): rename contact mongo base to contacts)
    },
  }
);

export default getContactRoutes;
