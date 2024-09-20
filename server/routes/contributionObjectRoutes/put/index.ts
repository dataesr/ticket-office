import Elysia, { Static, t } from "elysia";
import { ObjectId } from "mongodb";
import db from "../../../libs/mongo";
import { editSchema } from "../../../schemas/put/editSchema";

type ContributionType = Static<typeof editSchema>;
const contributionObjectPutRoutes = new Elysia();

contributionObjectPutRoutes.put(
  "/contribute/:id",
  async ({
    params: { id },
    body,
    error,
  }: {
    params: { id: string };
    body: ContributionType;
    error: (status: number, message: string) => any;
  }) => {
    const data = body;

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
      .findOne<ContributionType>({ _id: new ObjectId(id) });

    if (!updatedContact) {
      return error(500, "Failed to retrieve updated contact");
    }

    return updatedContact;
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      idref: t.String(),
      status: t.String(),
      team: t.Array(t.String()),
      tags: t.Array(t.String()),
      comment: t.String(),
    }),
    response: {
      200: t.Any(),
      400: t.Object({ message: t.String() }),
      404: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      summary: "Modifier une contribution via formulaire par objet et par ID",
      description:
        "Cette route permet de mettre à jour une contribution spécifique via l'ID fourni. Elle permet de modifier le statut, l'idref, d'ajouter la personne modifiant dans l'équipe, et de mettre à jour la date de traitement et de modification.",
      tags: ["Contribution par objet"],
    },
  }
);

const isValidData = (data: {
  idref?: string;
  status?: string;
  team?: Array<string>;
  tags?: Array<string>;
  comment?: string;
}) => {
  const { idref, status, team, tags, comment } = data;
  if (idref && typeof idref !== "string") return false;
  if (status && typeof status !== "string") return false;
  if (team && !Array.isArray(team)) return false;
  if (tags && !Array.isArray(tags)) return false;
  if (comment && typeof comment !== "string") return false;
  return true;
};

export default contributionObjectPutRoutes;
