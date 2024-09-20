import Elysia, { Static } from "elysia";
import { ObjectId } from "mongodb";
import db from "../../../libs/mongo";
import { editSchema } from "../../../schemas/put/editSchema";

type contributionType = Static<typeof editSchema>;
const contributionObjectPutRoutes = new Elysia();

const isValidData = (data: {
  idref: string;
  status: string;
  team: Array<string>;
  tags: Array<string>;
  comment: string;
}) => {
  const { idref, status, team, tags, comment } = data;
  if (idref && typeof idref !== "string") return false;
  if (status && typeof status !== "string") return false;
  if (team && !Array.isArray(team)) return false;
  if (tags && !Array.isArray(tags)) return false;
  if (comment && typeof comment !== "string") return false;
  return true;
};

contributionObjectPutRoutes.put(
  "/contribute/:id",
  async ({ params: { id }, request, error }) => {
    const data = await request.json();

    if (!isValidData(data)) {
      return error(400, "Invalid input data");
    }

    const result = await db
      .collection("contribute")
      .updateOne({ _id: new ObjectId(id) }, { $set: data });

    if (result.matchedCount === 0) {
      return error(404, "No contribution found with this ID");
    }

    const updatedContact = await db
      .collection("contribute")
      .findOne<contributionType>({ _id: new ObjectId(id) });

    if (!updatedContact) {
      return error(500, "Failed to retrieve updated contact");
    }

    return updatedContact;
  },
  {
    detail: {
      summary: "Modifier une contribution via formulaire par objet et par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, l'idref, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contribution par objet"],
    },
  }
);

export default contributionObjectPutRoutes;
