import Elysia, { Static } from "elysia";
import { ObjectId } from "mongodb";
import db from "../../../libs/mongo";
import { editSchema } from "../../../schemas/put/editSchema";

type updateUserDataType = Static<typeof editSchema>;
const updateUserDataPutRoutes = new Elysia();

updateUserDataPutRoutes.put(
  "/update-user-data/:id",
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

    if (updateData.comment && typeof updateData.comment !== "string") {
      return error(400, "comment must be a string");
    }
    if (updateData.team && !Array.isArray(updateData.team)) {
      return error(400, "team must be an array");
    }

    if (updateData.idref && typeof updateData.idref !== "string") {
      return error(400, "idref must be a string");
    }

    if (updateData.status && typeof updateData.status !== "string") {
      return error(400, "status must be a string");
    }

    const result = await db
      .collection("update-user-data")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return error(400, "No contact found with this ID");
    }

    const updatedContact = await db
      .collection("update-user-data")
      .findOne<updateUserDataType>({
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
        "Modifier une contribution via formulaire de mise à jour de donnée par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni.",
      tags: ["Mise à jour de données utilisateur"],
    },
  }
);

export default updateUserDataPutRoutes;
