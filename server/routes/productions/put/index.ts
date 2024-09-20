import Elysia, { Static } from "elysia";
import { ObjectId } from "mongodb";
import db from "../../../libs/mongo";
import { editSchema } from "../../../schemas/put/editSchema";

type productionType = Static<typeof editSchema>;
const productionsPutRoutes = new Elysia();

productionsPutRoutes.put(
  "/production/:id",
  async ({ params: { id }, request, error }) => {
    const updateData = await request.json();

    if (
      updateData.status &&
      ["ongoing", "treated"].includes(updateData.status)
    ) {
      updateData.treatedAt = new Date();
    }

    if (updateData.team && Array.isArray(updateData.team)) {
      const userWhoModified = updateData.team[0];
      if (!updateData.team.includes(userWhoModified)) {
        updateData.team.push(userWhoModified);
      }
    }

    const result = await db
      .collection("contribute_productions")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return error(400, "No contact found with this ID");
    }

    const updatedContact = await db
      .collection("contribute_productions")
      .findOne<productionType>({
        _id: new ObjectId(id),
      });

    if (!updatedContact) {
      return error(500, "Failed to retrieve updated contact");
    }

    return updatedContact;
  },
  {
    detail: {
      summary:
        "Modifier une contribution via formulaire de liaison de productions par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni.",
      tags: ["Production"],
    },
  }
);

export default productionsPutRoutes;
