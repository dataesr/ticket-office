import Elysia, { Static } from "elysia";
import { ObjectId } from "mongodb";
import db from "../../../libs/mongo";
import { putContactSchema } from "../../../schemas/put/contactSchema";

type contactType = Static<typeof putContactSchema>;
const contactPutRoutes = new Elysia();

contactPutRoutes.put(
  "/contact/:id",
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
      .collection("contact")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return error(400, "No contact found with this ID");
    }

    const updatedContact = await db.collection("contact").findOne<contactType>({
      _id: new ObjectId(id),
    });

    if (!updatedContact) {
      return error(500, "Failed to retrieve updated contact");
    }

    return updatedContact;
  },
  {
    body: putContactSchema,
    detail: {
      summary: "Modifier une contribution via formulaire de contact par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, l'idref, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contact"],
    },
  }
);

export default contactPutRoutes;
