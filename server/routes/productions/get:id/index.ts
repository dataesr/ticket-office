import Elysia, { Static } from "elysia";
import db from "../../../libs/mongo";
import { ObjectId } from "mongodb";
import { productionSchema } from "../../../schemas/get/productionSchema";

type productionType = Static<typeof productionSchema>;

const getProductionByIdRoutes = new Elysia();

getProductionByIdRoutes.get(
  "/production/:id",
  async ({ params: { id } }) => {
    const production = await db
      .collection("contribute_productions")
      .findOne<productionType>({
<<<<<<< HEAD
<<<<<<< HEAD
        id: new ObjectId(id),
=======
        _id: new ObjectId(id),
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
        id: new ObjectId(id),
>>>>>>> 2e9190f (fix(api): update schemas)
      })
      .catch((error) => error(500, "Failed to fetch production"));

    if (!production) return { message: "Une erreur s'est produite" };

    return production;
  },
  {
<<<<<<< HEAD
<<<<<<< HEAD
=======
    body: productionSchema,
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> dc7be2b (fix(schema): clean schemas)
    detail: {
      summary: "Obtenir une contribution de liaison de productions par ID",
      description:
        "Cette route retourne les détails d'une contribution spécifique via l'ID fourni.",
      tags: ["Production"],
    },
  }
);

export default getProductionByIdRoutes;
