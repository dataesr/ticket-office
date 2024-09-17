import Elysia, { Static } from "elysia";
import { ObjectId } from "mongodb";
import db from "../../../libs/mongo";
import { putContactSchema } from "../../../schemas/put/contactSchema";

type contactType = Static<typeof putContactSchema>;
const contributionObjectPutRoutes = new Elysia();

contributionObjectPutRoutes.put(
  "/contribute/:id",
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
      .collection("contribute")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return error(400, "No contribution found with this ID");
    }

    const updatedContribution = await db
      .collection("contribute")
      .findOne<contactType>({
        _id: new ObjectId(id),
      });

    if (!updatedContribution) {
      return error(500, "Failed to retrieve updated contribution");
    }

    return updatedContribution;
  },
  {
    body: putContactSchema,
    detail: {
      summary: "Modifier une contribution via formulaire par objet et par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, l'idref, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contribution par objet"],
    },
  }
);

export default contributionObjectPutRoutes;
