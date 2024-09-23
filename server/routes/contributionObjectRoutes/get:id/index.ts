<<<<<<< HEAD
<<<<<<< HEAD
import Elysia, { Static, t } from "elysia";
=======
import Elysia, { Static } from "elysia";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import Elysia, { Static, t } from "elysia";
>>>>>>> dc7be2b (fix(schema): clean schemas)
import db from "../../../libs/mongo";
import { ObjectId } from "mongodb";
import { contactSchema } from "../../../schemas/get:id/contactSchema";

type contributionObjectType = Static<typeof contactSchema>;

const getContributionObjectByIdRoutes = new Elysia();

getContributionObjectByIdRoutes.get(
  "/contribute/:id",
  async ({ params: { id } }) => {
<<<<<<< HEAD
    const contribution = await db
      .collection("contribute")
      .findOne<contributionObjectType>({
        id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch contribution"));

    if (!contribution) return { message: "Une erreur s'est produite" };

    return contribution;
  },
  {
    response: {
      400: t.Object({ message: t.String() }),
      401: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
=======
    const contact = await db
      .collection("contribute")
      .findOne<contributionObjectType>({
        _id: new ObjectId(id),
      })
      .catch((error) => error(500, "Failed to fetch contribution"));

    if (!contact) return { message: "Une erreur s'est produite" };

    return contact;
  },
  {
<<<<<<< HEAD
    body: contactSchema,
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
    response: {
      400: t.Object({ message: t.String() }),
      401: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
>>>>>>> dc7be2b (fix(schema): clean schemas)
    detail: {
      summary:
        "Obtenir une contribution via formulaire de contribution par objet par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Contribution par objet"],
    },
  }
);

export default getContributionObjectByIdRoutes;
